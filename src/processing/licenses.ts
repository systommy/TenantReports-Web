import type { LicenseOverview, LicenseItem, LicenseChange } from './types'
import { formatDate } from '../utils/format'

function getDict(source: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = source[key]
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}
  return value as Record<string, unknown>
}

export function processLicenseOverview(data: Record<string, unknown>): LicenseOverview {
  const alloc = getDict(data, 'LicenseAllocation')
  const summary = getDict(alloc, 'Summary')
  const licenses = Array.isArray(alloc.Licenses) ? alloc.Licenses : []

  const licenseRows: LicenseItem[] = []
  for (const item of licenses) {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) continue
    const l = item as Record<string, unknown>
    licenseRows.push({
      name: (l.FriendlyName as string) ?? (l.SkuPartNumber as string) ?? null,
      sku: (l.SkuPartNumber as string) ?? null,
      assigned: (l.ConsumedUnits as number) ?? 0,
      available: (l.AvailableUnits as number) ?? 0,
      utilization: (l.Utilization as number) ? (l.Utilization as number) / 100 : 0,
    })
  }

  return {
    summary: {
      total_subscriptions: (summary.TotalSubscriptions as number) ?? 0,
      active_subscriptions: (summary.ActiveSubscriptions as number) ?? 0,
      licenses_purchased: (summary.TotalLicensesPurchased as number) ?? 0,
      licenses_assigned: (summary.TotalLicensesAssigned as number) ?? 0,
      licenses_available: (summary.TotalLicensesAvailable as number) ?? 0,
      overall_utilization: 0, 
    },
    licenses: licenseRows,
  }
}

export function processLicenseChanges(data: Record<string, unknown>): LicenseChange[] {
  const changes = Array.isArray(data.LicenseChangeAudit) ? data.LicenseChangeAudit : []
  const rows: LicenseChange[] = []

  for (const item of changes) {
    if (typeof item !== 'object' || item === null) continue
    const l = item as Record<string, unknown>
    rows.push({
      timestamp: formatDate((l.Timestamp as string) ?? null),
      user: (l.InitiatedBy as string) ?? 'System',
      target_user: (l.TargetUser as string) ?? (l.TargetUserUPN as string) ?? 'Unknown',
      action: (l.Activity as string) ?? (l.Action as string) ?? 'Unknown',
      sku: (l.Sku as string) ?? (l.License as string) ?? '-',
    })
  }
  return rows
}
