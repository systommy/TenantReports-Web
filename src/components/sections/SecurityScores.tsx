import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Activity } from 'lucide-react'
import StatusPill from '../common/StatusPill'
import DataTable from '../tables/DataTable'
import LineChart from '../charts/LineChart'
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

interface Props {
    data: SecurityScoresData;
    historyLabels: string[];
    historyValues: number[];
}

export default function SecurityScores({ data, historyLabels, historyValues }: Props) {
  const sortedControls = useMemo(
    () => [...data.control_scores].sort((a, b) => b.score_gap - a.score_gap),
    [data.control_scores],
  )
  
  return (
    <div className="space-y-12">
      {/* MS365 Section */}
      <div id="ms365-secure-score" className="space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">MS365 Secure Score</h3>
        
        {/* Security Trends Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h4 className="font-bold text-gray-900">Security Trends</h4>
                    <p className="text-sm text-gray-500">Score performance over time</p>
                </div>
            </div>
            <div className="w-full h-64">
                {historyLabels.length > 0 ? (
                    <LineChart labels={historyLabels} values={historyValues} label="Secure Score" title="" />
                ) : (
                    <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-400">
                        <div className="text-center">
                            <Activity size={32} className="mx-auto mb-2 opacity-50" />
                            <span className="text-sm font-medium">No history data available</span>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <DataTable 
            title="Top Recommendations (by Score Gap)"
            columns={controlColumns} 
            data={sortedControls} 
            pageSize={5}
        />
      </div>

      {/* Azure Section */}
      {data.azure_subscriptions.length > 0 && (
        <div id="azure-secure-score" className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Azure Secure Score</h3>
            <DataTable 
                title="Azure Subscriptions"
                columns={azureColumns} 
                data={data.azure_subscriptions} 
            />
        </div>
      )}
    </div>
  )
}