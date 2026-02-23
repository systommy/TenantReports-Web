import { formatDate } from '../utils/format'
import type { DefenderSummary } from './types'

function getDict(source: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = source[key]
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}
  return value as Record<string, unknown>
}

export function processDefenderSummary(data: Record<string, unknown>): DefenderSummary | null {
  if (!('DefenderEmail' in data)) return null
  const defender = getDict(data, 'DefenderEmail')
  const summary = getDict(defender, 'Summary')
  const alerts = Array.isArray(defender.Alerts) ? defender.Alerts : []

  const alertRows: DefenderSummary['alerts'] = []
  const bySeverity: Record<string, number> = {}
  const byStatus: Record<string, number> = {}

  for (const alert of alerts) {
    if (typeof alert !== 'object' || alert === null || Array.isArray(alert)) continue
    const alt = alert as Record<string, unknown>
    
    const severity = (alt.Severity as string) || 'Unknown'
    const status = (alt.Status as string) || 'Unknown'
    
    bySeverity[severity] = (bySeverity[severity] ?? 0) + 1
    byStatus[status] = (byStatus[status] ?? 0) + 1

    const affectedUsersRaw = alt.AffectedUsers
    let userCount = 0
    let affectedUsersStr = ''

    if (typeof affectedUsersRaw === 'string') {
      affectedUsersStr = affectedUsersRaw
      userCount = affectedUsersRaw.split(',').filter(u => u.trim().length > 0).length
    } else if (Array.isArray(affectedUsersRaw)) {
      affectedUsersStr = affectedUsersRaw.join(', ')
      userCount = affectedUsersRaw.length
    }

    alertRows.push({
      id: (alt.AlertId as string) ?? '',
      title: (alt.Title as string) ?? null,
      category: (alt.Category as string) ?? null,
      severity,
      status,
      description: (alt.Description as string) ?? null,
      assigned_to: (alt.AssignedTo as string) ?? null,
      created: formatDate(alt.CreatedDateTime as string | null),
      affected_users: affectedUsersStr || null,
      user_count: userCount,
      url: (alt.AlertUrl as string) ?? null,
    })
  }

  return { summary, alerts: alertRows, by_severity: bySeverity, by_status: byStatus }
}
