import { formatDate } from '../utils/format'
import type { ServicePrincipals, AppRegistrationData, AppRegistrationSummary, AppRegistrationCredential } from './types'

function getDict(source: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = source[key]
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}
  return value as Record<string, unknown>
}

const RISK_ORDER: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1, '': 0 }

export function processServicePrincipals(data: Record<string, unknown>): ServicePrincipals | null {
  if (!('ServicePrincipals' in data)) return null
  const principals = getDict(data, 'ServicePrincipals')
  const allPermissions = Array.isArray(principals.AllPermissions) ? principals.AllPermissions : []

  const expiringCredentials: ServicePrincipals['expiring_credentials'] = []
  for (const item of allPermissions) {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) continue
    const it = item as Record<string, unknown>
    if (it.GrantExpiryTime) {
      expiringCredentials.push({
        name: (it.ClientApplicationName as string) ?? null,
        app_id: (it.ClientApplicationId as string) ?? null,
        expires_on: formatDate(it.GrantExpiryTime as string),
        type: (it.Permission as string) ?? null,
      })
    }
  }

  const allAppsMap: Record<string, { name: string; risk_level: string; consent_type: string | null; principal: string | null; permissions: { resource: string | null; permission: string | null; risk_level: string | null; consent_type: string | null; principal: string | null }[] }> = {}
  const riskCounts = { critical: 0, high: 0, medium: 0, low: 0 }

  for (const item of allPermissions) {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) continue
    const it = item as Record<string, unknown>
    const appName = it.ClientApplicationName as string | undefined
    if (!appName) continue

    const riskLevel = ((it.RiskLevel as string) ?? '').toLowerCase()

    if (!allAppsMap[appName]) {
      allAppsMap[appName] = {
        name: appName,
        risk_level: riskLevel,
        consent_type: (it.ConsentType as string) ?? null,
        principal: (it.PrincipalDisplayName as string) || (it.PrincipalUserPrincipalName as string) || null,
        permissions: [],
      }
    } else {
      const current = allAppsMap[appName].risk_level
      if ((RISK_ORDER[riskLevel] ?? 0) > (RISK_ORDER[current] ?? 0)) {
        allAppsMap[appName].risk_level = riskLevel
      }
    }

    allAppsMap[appName].permissions.push({
      resource: (it.ResourceFriendlyName as string) ?? null,
      permission: (it.Permission as string) ?? null,
      risk_level: (it.RiskLevel as string) ?? null,
      consent_type: (it.ConsentType as string) ?? null,
      principal: (it.PrincipalDisplayName as string) || (it.PrincipalUserPrincipalName as string) || null,
    })
  }

  const allRows: ServicePrincipals['all_apps'] = []
  for (const app of Object.values(allAppsMap)) {
    const risk = app.risk_level as keyof typeof riskCounts
    if (risk in riskCounts) riskCounts[risk]++
    allRows.push(app)
  }

  allRows.sort((a, b) => (RISK_ORDER[b.risk_level] ?? 0) - (RISK_ORDER[a.risk_level] ?? 0))

  return {
    expiring_credentials: expiringCredentials,
    all_apps: allRows,
    summary: {
      total: allRows.length,
      critical: riskCounts.critical,
      high: riskCounts.high,
      medium: riskCounts.medium,
      low: riskCounts.low,
    },
  }
}

export function processAppCredentials(data: Record<string, unknown>): AppRegistrationData | null {
  if (!('AppRegistrationExpiry' in data)) return null
  const root = getDict(data, 'AppRegistrationExpiry')
  const summaryRaw = getDict(root, 'Summary')
  const credentialsRaw = Array.isArray(root.Credentials) ? root.Credentials : []

  const summary: AppRegistrationSummary = {
    TenantId: (summaryRaw.TenantId as string) ?? '',
    ReportGeneratedDate: (summaryRaw.ReportGeneratedDate as string) ?? '',
    DaysUntilExpiryThreshold: (summaryRaw.DaysUntilExpiryThreshold as number) ?? 0,
    TotalCredentials: (summaryRaw.TotalCredentials as number) ?? 0,
    ExpiredCount: (summaryRaw.ExpiredCount as number) ?? 0,
    ExpiringSoonCount: (summaryRaw.ExpiringSoonCount as number) ?? 0,
    ValidCount: (summaryRaw.ValidCount as number) ?? 0,
    AppsWithExpiredOrExpiring: (summaryRaw.AppsWithExpiredOrExpiring as number) ?? 0,
  }

  const credentials: AppRegistrationCredential[] = []

  for (const item of credentialsRaw) {
    if (typeof item !== 'object' || item === null) continue
    const e = item as Record<string, unknown>
    credentials.push({
      AppDisplayName: (e.AppDisplayName as string) ?? '',
      AppId: (e.AppId as string) ?? '',
      ObjectId: (e.ObjectId as string) ?? '',
      CredentialType: (e.CredentialType as string) ?? '',
      CredentialName: (e.CredentialName as string) ?? null,
      KeyId: (e.KeyId as string) ?? '',
      StartDate: (e.StartDate as string) ?? '',
      EndDate: (e.EndDate as string) ?? '',
      DaysRemaining: (e.DaysRemaining as number) ?? 0,
      Status: (e.Status as string) ?? '',
    })
  }

  return {
    summary,
    credentials,
  }
}
