import { formatDate } from '../utils/format'
import type { TenantOverview, Domain } from './types'

function getDict(source: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = source[key]
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}
  return value as Record<string, unknown>
}

export function processTenantOverview(data: Record<string, unknown>): TenantOverview {
  const tenantInfo = getDict(data, 'TenantInfo')
  const summary = getDict(tenantInfo, 'Summary')
  const metadata = getDict(data, 'ReportMetadata')
  return {
    organization_name: (summary.OrganizationName as string) ?? 'Unknown',
    primary_domain: (summary.PrimaryDomain as string) ?? 'Unknown',
    domains_total: (summary.TotalDomains as number) ?? 0,
    generation_date: formatDate(metadata.GeneratedDate as string | null),
  }
}

export function processDomains(data: Record<string, unknown>): Domain[] {
  const tenantInfo = getDict(data, 'TenantInfo')
  const allDomains = tenantInfo.AllDomains
  if (!Array.isArray(allDomains)) return []
  const rows: Domain[] = []
  for (const domain of allDomains) {
    if (typeof domain === 'object' && domain !== null && !Array.isArray(domain)) {
      const d = domain as Record<string, unknown>
      rows.push({
        domain: (d.Id as string) ?? null,
        is_default: Boolean(d.IsDefault),
        is_initial: Boolean(d.IsInitial),
        is_verified: Boolean(d.IsVerified),
        authentication_type: (d.AuthenticationType as string) ?? null,
      })
    }
  }
  return rows
}
