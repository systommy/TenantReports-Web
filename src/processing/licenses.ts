import type { LicenseOverview } from './types'

function getDict(source: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = source[key]
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}
  return value as Record<string, unknown>
}

export function processLicenseOverview(data: Record<string, unknown>): LicenseOverview {
  const allocation = getDict(data, 'LicenseAllocation')
  const summary = getDict(allocation, 'Summary')
  const rawLicenses = Array.isArray(allocation.Licenses) ? allocation.Licenses : []

  const licenses: LicenseOverview['licenses'] = []
  for (const item of rawLicenses) {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) continue
    const it = item as Record<string, unknown>
    licenses.push({
      name: (it.FriendlyName as string) || (it.SkuPartNumber as string) || null,
      sku: (it.SkuPartNumber as string) ?? null,
      assigned: (it.ConsumedUnits as number) ?? 0,
      available: (it.AvailableUnits as number) ?? 0,
      utilization: (it.Utilization as number) ?? 0,
    })
  }

  return {
    summary: {
      total_subscriptions: (summary.TotalSubscriptions as number) ?? 0,
      active_subscriptions: (summary.ActiveSubscriptions as number) ?? 0,
      licenses_purchased: (summary.TotalLicensesPurchased as number) ?? 0,
      licenses_assigned: (summary.TotalLicensesAssigned as number) ?? 0,
      licenses_available: (summary.TotalLicensesAvailable as number) ?? 0,
      overall_utilization: (summary.OverallUtilization as number) ?? 0,
    },
    licenses,
  }
}
