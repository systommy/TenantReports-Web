import { formatDate } from '../utils/format'
import type { DefenderIncidents } from './types'

export function processDefenderIncidents(data: Record<string, unknown>): DefenderIncidents | null {
  if (!('DefenderIncidents' in data)) return null
  const dData = data.DefenderIncidents as Record<string, unknown>
  
  const incidentsRaw = Array.isArray(dData.Incidents) ? dData.Incidents : []
  const summary = dData.Summary as Record<string, unknown> || {}
  
  const rows: DefenderIncidents['incidents'] = []
  const bySeverity: Record<string, number> = {}
  const byStatus: Record<string, number> = {}

  // Process raw incidents
  for (const incident of incidentsRaw) {
    if (typeof incident !== 'object' || incident === null || Array.isArray(incident)) continue
    const inc = incident as Record<string, unknown>

    const severity = (inc.Severity as string) || 'Unknown'
    const status = (inc.Status as string) || 'Unknown'

    rows.push({
      created: formatDate((inc.CreatedDateTime as string) || (inc.CreatedTime as string) || null),
      incident_id: (inc.IncidentId as string) ?? '',
      title: (inc.DisplayName as string) || (inc.Title as string) || (inc.Name as string) || null,
      severity,
      status,
      classification: (inc.Classification as string) ?? null,
      determination: (inc.Determination as string) ?? null,
      url: (inc.IncidentUrl as string) ?? null,
      comments: (inc.Comments as string) ?? '',
    })
  }

  // Use summary data for charts if available, otherwise aggregate from rows
  if (Array.isArray(summary.BySeverity)) {
    summary.BySeverity.forEach((item: any) => {
      Object.entries(item).forEach(([k, v]) => { bySeverity[k] = v as number })
    })
  } else {
    rows.forEach(r => { bySeverity[r.severity] = (bySeverity[r.severity] ?? 0) + 1 })
  }

  if (Array.isArray(summary.ByStatus)) {
    summary.ByStatus.forEach((item: any) => {
      Object.entries(item).forEach(([k, v]) => { byStatus[k] = v as number })
    })
  } else {
    rows.forEach(r => { byStatus[r.status] = (byStatus[r.status] ?? 0) + 1 })
  }

  return { 
    incidents: rows, 
    by_severity: bySeverity, 
    by_status: byStatus, 
    total: (summary.TotalIncidents as number) ?? rows.length 
  }
}
