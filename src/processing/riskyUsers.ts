import { formatDate } from '../utils/format'
import type { RiskyUser } from './types'

function getDict(source: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = source[key]
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}
  return value as Record<string, unknown>
}

export function processRiskyUsers(data: Record<string, unknown>): RiskyUser[] | null {
  if (!('RiskyUsers' in data)) return null
  const risky = getDict(data, 'RiskyUsers')
  const entries = Array.isArray(risky.RiskyUsers) ? risky.RiskyUsers : []
  const rows: RiskyUser[] = []

  for (const entry of entries) {
    if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) continue
    const e = entry as Record<string, unknown>
    rows.push({
      user: (e.UserPrincipalName as string) ?? null,
      risk_level: (e.RiskLevel as string) ?? null,
      risk_state: (e.RiskState as string) ?? null,
      last_updated: formatDate(e.RiskLastUpdatedDateTime as string | null),
    })
  }
  return rows
}
