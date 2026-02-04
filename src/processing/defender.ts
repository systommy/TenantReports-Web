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
  const threats = Array.isArray(defender.Threats) ? defender.Threats : []

  const threatRows: DefenderSummary['threats'] = []
  for (const threat of threats) {
    if (typeof threat !== 'object' || threat === null || Array.isArray(threat)) continue
    const t = threat as Record<string, unknown>
    threatRows.push({
      name: (t.ThreatName as string) ?? null,
      severity: (t.Severity as string) ?? null,
      category: (t.Category as string) ?? null,
      detected: formatDate(t.DetectedDate as string | null),
    })
  }

  return { summary, threats: threatRows }
}
