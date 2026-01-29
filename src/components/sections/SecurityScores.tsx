import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import StatusPill from '../common/StatusPill'
import DataTable from '../tables/DataTable'
import { pct } from '../../utils/format'
import type { SecurityScores as SecurityScoresData, ControlScore, AzureSubscription } from '../../processing/types'

const controlColumns: ColumnDef<ControlScore, unknown>[] = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'category', header: 'Category' },
  {
    accessorKey: 'status', header: 'Status',
    cell: ({ getValue }) => {
      const v = (getValue() as string)?.toLowerCase()
      const intent = v === 'completed' || v === 'protected' ? 'success' : v === 'ignored' ? 'neutral' : 'warning';
      return <StatusPill label={String(getValue() ?? '')} intent={intent} />
    },
  },
  { accessorKey: 'score', header: 'Score' },
  { accessorKey: 'max_score', header: 'Max Score' },
  { accessorKey: 'score_gap', header: 'Gap' },
]

const azureColumns: ColumnDef<AzureSubscription, unknown>[] = [
  { accessorKey: 'name', header: 'Subscription Name' },
  { accessorKey: 'id', header: 'Subscription ID' },
  { accessorKey: 'score', header: 'Score' },
  { accessorKey: 'max_score', header: 'Max Score' },
  { 
    accessorKey: 'percentage', header: 'Percentage',
    cell: ({ getValue }) => pct(getValue() as number)
  },
]

export default function SecurityScores({ data }: { data: SecurityScoresData }) {
  const sortedControls = useMemo(
    () => [...data.control_scores].sort((a, b) => b.score_gap - a.score_gap),
    [data.control_scores],
  )
  
  return (
    <div className="space-y-8">
      {/* MS365 Section */}
      <div className="space-y-4">
        <DataTable 
            title="Top Recommendations (by Score Gap)"
            columns={controlColumns} 
            data={sortedControls} 
            pageSize={5}
        />
      </div>

      {/* Azure Section */}
      <div className="space-y-4">
        {data.azure_subscriptions.length > 0 && (
          <DataTable 
            title="Azure Security Scores"
            columns={azureColumns} 
            data={data.azure_subscriptions} 
          />
        )}
      </div>
    </div>
  )
}