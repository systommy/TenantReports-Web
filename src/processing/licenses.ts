import type { LicenseOverview, LicenseItem, LicenseChange } from './types'
import { formatDate } from '../utils/format'

function getDict(source: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = source[key]
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}
  return value as Record<string, unknown>
}

function toArray(source: unknown): unknown[] {
  if (Array.isArray(source)) return source
  if (typeof source === 'object' && source !== null) return Object.values(source)
  return []
}

function extractSku(raw: string): string {
    const match = raw.match(/SkuName=([^,\]]+)/)
    return match ? match[1] : raw
}

export function processLicenseOverview(data: Record<string, unknown>): LicenseOverview {
  const alloc = getDict(data, 'LicenseAllocation')
  const summary = getDict(alloc, 'Summary')
  const licenses = toArray(alloc.Licenses)

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
  let raw = data.LicenseChangeAudit
  if (raw && typeof raw === 'object' && 'Changes' in raw) {
      raw = (raw as Record<string, unknown>).Changes
  }
  
  const changes = toArray(raw)
  const rows: LicenseChange[] = []

  for (const item of changes) {
    if (typeof item !== 'object' || item === null) continue
    const l = item as Record<string, unknown>
    
    const timestamp = formatDate((l.ActivityDate as string) ?? (l.Timestamp as string) ?? null)
    const user = (l.InitiatedBy as string) ?? 'System'
    const target = (l.UserPrincipal as string) ?? (l.TargetUser as string) ?? (l.TargetUserUPN as string) ?? 'Unknown'
    
    const added = toArray(l.AddedLicenses) as string[]
    const removed = toArray(l.RemovedLicenses) as string[]
    
    if (added.length > 0 || removed.length > 0) {
        // New format with arrays
        for (const lic of added) {
            rows.push({
                timestamp,
                user,
                target_user: target,
                action: 'Assigned',
                sku: extractSku(String(lic))
            })
        }
        for (const lic of removed) {
            rows.push({
                timestamp,
                user,
                target_user: target,
                action: 'Removed',
                sku: extractSku(String(lic))
            })
        }
    } else {
        // Legacy format or unknown
        rows.push({
            timestamp,
            user,
            target_user: target,
            action: (l.Activity as string) ?? (l.Action as string) ?? 'Unknown',
            sku: (l.Sku as string) ?? (l.License as string) ?? '-',
        })
    }
  }
  
  // Sort by date desc (if not already)
  return rows.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}
