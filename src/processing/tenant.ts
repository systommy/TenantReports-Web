import type { TenantOverview, Domain, TenantConfiguration } from './types'
import { formatDate } from '../utils/format'

function getDict(source: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = source[key]
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}
  return value as Record<string, unknown>
}

export function processTenantOverview(data: Record<string, unknown>): TenantOverview | null {
  if (!('TenantInfo' in data)) return null
  const tenantInfo = getDict(data, 'TenantInfo')
  const summary = getDict(tenantInfo, 'Summary')
  const directoryStats = getDict(tenantInfo, 'DirectoryStatistics')
  const metadata = getDict(data, 'ReportMetadata')

  return {
    organization_name: (summary.OrganizationName as string) ?? 'Unknown Organization',
    primary_domain: (summary.PrimaryDomain as string) ?? '',
    domains_total: (summary.TotalDomains as number) ?? 0,
    generation_date: formatDate((summary.ReportGeneratedDate as string) ?? (metadata.GeneratedDate as string) ?? new Date().toISOString()),
    tenant_id: (summary.TenantId as string) ?? '',
    created_date: formatDate(summary.CreatedDateTime as string | null),
    total_devices: (directoryStats.TotalDevices as number) ?? 0,
    technical_notification_mails: Array.isArray(summary.TechnicalNotificationMails) ? summary.TechnicalNotificationMails as string[] : [],
    country_code: (summary.CountryLetterCode as string) ?? undefined,
    state: (summary.State as string) ?? undefined,
    city: (summary.City as string) ?? undefined,
    postal_code: (summary.PostalCode as string) ?? undefined,
    preferred_language: (summary.PreferredLanguage as string) ?? undefined,
  }
}

export function processDomains(data: Record<string, unknown>): Domain[] | null {
  if (!('TenantInfo' in data)) return null
  const tenantInfo = getDict(data, 'TenantInfo')
  const domains = Array.isArray(tenantInfo.AllDomains) ? tenantInfo.AllDomains : []
  
  const domainRows: Domain[] = []
  for (const item of domains) {
    if (typeof item !== 'object' || item === null) continue
    const d = item as Record<string, unknown>
    domainRows.push({
      domain: (d.Id as string) ?? null,
      is_default: Boolean(d.IsDefault),
      is_initial: Boolean(d.IsInitial),
      is_verified: Boolean(d.IsVerified),
      authentication_type: (d.AuthenticationType as string) ?? null,
    })
  }
  return domainRows
}

export function processTenantConfiguration(data: Record<string, unknown>): TenantConfiguration | null {
  if (!('TenantConfiguration' in data)) return null
  const config = getDict(data, 'TenantConfiguration')
  const summary = getDict(config, 'Summary')
  const settings = Array.isArray(config.Settings) ? config.Settings : []

  const rows = settings.map((item: any) => {
    let recommended = item.RecommendedValue;
    // Special case: 'Restricted access (most restrictive)' is more secure than 'Limited access', so treat it as compliant.
    if (item.SettingName === 'Guest user access level' && item.CurrentValue === 'Restricted access (most restrictive)') {
        recommended = 'Restricted access (most restrictive)';
    }

    return {
      category: item.Category,
      name: item.SettingName,
      current_value: item.CurrentValue,
      recommended_value: recommended,
      risk_level: item.RiskLevel,
      description: item.Description,
      recommendation: item.Recommendation,
    };
  })

  return {
    summary: {
      total: (summary.TotalSettings as number) ?? 0,
      high_risk: (summary.HighRiskCount as number) ?? 0,
      medium_risk: (summary.MediumRiskCount as number) ?? 0,
      low_risk: (summary.LowRiskCount as number) ?? 0,
    },
    settings: rows,
  }
}
