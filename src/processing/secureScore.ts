import { formatDate } from '../utils/format'
import type { SecurityScores } from './types'

function getDict(source: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = source[key]
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}
  return value as Record<string, unknown>
}

function parseHistoryDate(dateStr: string): Date | null {
  if (!dateStr) return null
  // Try DD-MM-YYYY HH:MM
  const full = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2})$/)
  if (full) return new Date(+full[3], +full[2] - 1, +full[1], +full[4], +full[5])
  // Try DD-MM-YYYY
  const dateOnly = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/)
  if (dateOnly) return new Date(+dateOnly[3], +dateOnly[2] - 1, +dateOnly[1])
  return null
}

export function processSecurityScores(data: Record<string, unknown>): SecurityScores {
  const secureScore = getDict(data, 'SecureScore')
  const azureScore = getDict(data, 'AzureSecureScore')
  const summary = getDict(secureScore, 'Summary')
  const azureSummary = getDict(azureScore, 'Summary')

  // Azure subscriptions
  const azureSubscriptions: SecurityScores['azure_subscriptions'] = []
  if (Array.isArray(azureScore.SubscriptionScores)) {
    for (const sub of azureScore.SubscriptionScores) {
      if (typeof sub === 'object' && sub !== null && !Array.isArray(sub)) {
        const s = sub as Record<string, unknown>
        azureSubscriptions.push({
          name: (s.SubscriptionName as string) ?? null,
          id: (s.SubscriptionId as string) ?? null,
          score: (s.CurrentScore as number) ?? null,
          max_score: (s.MaxScore as number) ?? null,
          percentage: (s.ScorePercentage as number) ?? null,
        })
      }
    }
  }

  const trendData = secureScore.TrendAnalysis
  const historicalScores = secureScore.HistoricalScores
  const historyPoints: { date: string; score: number | null }[] = []

  // Try HistoricalScores first
  if (Array.isArray(historicalScores) && historicalScores.length > 0) {
    for (const item of historicalScores) {
      if (typeof item !== 'object' || item === null || Array.isArray(item)) continue
      const it = item as Record<string, unknown>
      const score = it.CurrentScore as number | null | undefined
      let dateStr = it.CreatedDateTime as string | undefined
      if (!dateStr && it.Id) {
        const parts = (it.Id as string).split('_')
        if (parts.length > 1) dateStr = parts[parts.length - 1]
      }
      if (score != null && dateStr) {
        historyPoints.push({ date: formatDate(dateStr), score })
      }
    }
  }

  // Fallback to TrendAnalysis
  if (historyPoints.length === 0) {
    if (Array.isArray(trendData)) {
      for (const item of trendData) {
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          const it = item as Record<string, unknown>
          historyPoints.push({
            date: formatDate(it.CreatedDateTime as string | null),
            score: (it.CurrentScore as number) ?? null,
          })
        }
      }
    } else if (typeof trendData === 'object' && trendData !== null && !Array.isArray(trendData)) {
      const td = trendData as Record<string, unknown>
      if (td.OldestScoreDate) {
        historyPoints.push({ date: formatDate(td.OldestScoreDate as string), score: (td.OldestScore as number) ?? null })
      }
      if (td.LatestScoreDate) {
        historyPoints.push({ date: formatDate(td.LatestScoreDate as string), score: (td.LatestScore as number) ?? null })
      }
    }
  }

  // Calculate trend
  let trendValue = 0
  let trendDirection: 'increase' | 'decrease' | 'stable' = 'stable'

  if (historyPoints.length >= 2) {
    const parsed: { dateObj: Date; score: number }[] = []
    for (const p of historyPoints) {
      const d = parseHistoryDate(p.date)
      if (d && p.score != null) parsed.push({ dateObj: d, score: p.score })
    }
    if (parsed.length >= 2) {
      parsed.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())
      const oldest = parsed[0].score
      const latest = parsed[parsed.length - 1].score
      trendValue = latest - oldest
      if (trendValue > 0) trendDirection = 'increase'
      else if (trendValue < 0) trendDirection = 'decrease'
    }
  }

  // Control scores
  const allControls = secureScore.AllControls
  const controlScores: SecurityScores['control_scores'] = []
  const seenTitles = new Set<string>()

  if (Array.isArray(allControls)) {
    for (const ctrl of allControls) {
      if (typeof ctrl !== 'object' || ctrl === null || Array.isArray(ctrl)) continue
      const c = ctrl as Record<string, unknown>
      if (c.IsRecommendation !== true) continue
      const title = c.Title as string | undefined
      if (!title || seenTitles.has(title)) continue
      seenTitles.add(title)

      const category = (c.Category as string) || (c.Tier as string) || 'General'
      const status = (c.ImplementationStatus as string) || 'Not Implemented'

      controlScores.push({
        title,
        category,
        status,
        score: (c.CurrentScore as number) ?? 0,
        max_score: (c.MaxScore as number) ?? 0,
        score_gap: (c.ScoreGap as number) ?? 0,
        rank: (c.Rank as number) ?? null,
      })
    }
  }

  controlScores.sort((a, b) => (b.score_gap ?? 0) - (a.score_gap ?? 0))

  // Sort history by date ascending
  historyPoints.sort((a, b) => {
    const da = parseHistoryDate(a.date)
    const db = parseHistoryDate(b.date)
    return (da?.getTime() ?? 0) - (db?.getTime() ?? 0)
  })

  // Azure aggregate if missing
  let azureCurrent = azureSummary.CurrentScore as number | null | undefined ?? null
  let azureMax = azureSummary.MaxPossibleScore as number | null | undefined ?? null

  if ((azureCurrent == null || azureMax == null) && azureSubscriptions.length > 0) {
    azureCurrent = azureSubscriptions.reduce((sum, s) => sum + (s.score ?? 0), 0)
    azureMax = azureSubscriptions.reduce((sum, s) => sum + (s.max_score ?? 0), 0)
  }

  const trendDict = typeof trendData === 'object' && trendData !== null && !Array.isArray(trendData)
    ? trendData as Record<string, unknown>
    : null

  return {
    current_score: (summary.CurrentScore as number) ?? null,
    max_score: (summary.MaxPossibleScore as number) ?? null,
    score_percentage: (summary.ScorePercentage as number) ?? null,
    azure_score: azureCurrent,
    azure_max_score: azureMax,
    azure_subscriptions: azureSubscriptions,
    history: historyPoints,
    trend_value: trendValue,
    trend_direction: trendDirection,
    control_scores: controlScores,
    trend_percentage_change: trendDict ? (trendDict.PercentageChange as number) ?? null : null,
    trend_period_days: trendDict ? (trendDict.PeriodDays as number) ?? null : null,
  }
}
