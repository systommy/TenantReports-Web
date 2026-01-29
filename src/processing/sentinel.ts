import { formatDate } from '../utils/format'
import type { SentinelIncidents } from './types'

export function processSentinelIncidents(data: Record<string, unknown>): SentinelIncidents {
  const sentinelData = data.Sentinel ?? {}
  let incidents: unknown[]
  if (typeof sentinelData === 'object' && sentinelData !== null && !Array.isArray(sentinelData)) {
    const sd = sentinelData as Record<string, unknown>
    incidents = Array.isArray(sd.Incidents) ? sd.Incidents : []
  } else {
    incidents = Array.isArray(sentinelData) ? sentinelData : []
  }

  const rows: SentinelIncidents['incidents'] = []
  const bySeverity: Record<string, number> = {}
  const byStatus: Record<string, number> = {}

  for (const incident of incidents) {
    if (typeof incident !== 'object' || incident === null || Array.isArray(incident)) continue
    const inc = incident as Record<string, unknown>

    const severity = (inc.Severity as string) || 'Unknown'
    const status = (inc.Status as string) || 'Unknown'

    bySeverity[severity] = (bySeverity[severity] ?? 0) + 1
    byStatus[status] = (byStatus[status] ?? 0) + 1

    rows.push({
      created: formatDate((inc.CreatedDateTime as string) || (inc.CreatedTime as string) || null),
      incident_id: (inc.IncidentId as string) ?? '',
      title: (inc.DisplayName as string) || (inc.Title as string) || (inc.Name as string) || null,
      severity,
      status,
      classification: (inc.Classification as string) ?? null,
      comments: (inc.Comments as string) ?? '',
    })
  }

  return { incidents: rows, by_severity: bySeverity, by_status: byStatus, total: rows.length }
}
