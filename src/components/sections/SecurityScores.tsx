import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import Section from '../Section'
import MetricCard from '../MetricCard'
import Badge from '../Badge'
import DataTable from '../tables/DataTable'
import LineChart from '../charts/LineChart'
import { statusStyle } from '../../utils/badges'
import { pct } from '../../utils/format'
import type { SecurityScores as SecurityScoresData, ControlScore } from '../../processing/types'

const columns: ColumnDef<ControlScore, unknown>[] = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'category', header: 'Category' },
  {
    accessorKey: 'status', header: 'Status',
    cell: ({ getValue }) => {
      const v = getValue() as string
      return <Badge label={v} style={statusStyle(v)} />
    },
  },
  { accessorKey: 'score', header: 'Score' },
  { accessorKey: 'max_score', header: 'Max Score' },
  { accessorKey: 'score_gap', header: 'Gap' },
]

const arrows: Record<string, string> = { increase: '\u2191', decrease: '\u2193', stable: '\u2192' }

export default function SecurityScores({ data }: { data: SecurityScoresData }) {
  const sorted = useMemo(
    () => [...data.control_scores].sort((a, b) => b.score_gap - a.score_gap),
    [data.control_scores],
  )
  const historyLabels = data.history.map(h => h.date)
  const historyValues = data.history.map(h => h.score ?? 0)

  return (
    <Section title="Security Scores" id="security-scores">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard label="MS365 Score" value={`${data.current_score ?? 0} / ${data.max_score ?? 0}`} />
        <MetricCard label="MS365 %" value={pct(data.score_percentage)} />
        <MetricCard label="Azure Score" value={`${data.azure_score ?? 0} / ${data.azure_max_score ?? 0}`} />
        <MetricCard label="Trend" value={`${data.trend_value} ${arrows[data.trend_direction] ?? ''}`} />
      </div>
      {historyLabels.length > 0 && (
        <div className="mb-6">
          <LineChart labels={historyLabels} values={historyValues} label="Secure Score" title="Secure Score History" />
        </div>
      )}
      <DataTable columns={columns} data={sorted} />
    </Section>
  )
}
