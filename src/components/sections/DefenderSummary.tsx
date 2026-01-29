import type { ColumnDef } from '@tanstack/react-table'
import DataTable from '../tables/DataTable'
import StatusPill from '../common/StatusPill'
import { formatDate } from '../../utils/format'
import type { DefenderSummary as DefenderSummaryData } from '../../processing/types'

type Threat = DefenderSummaryData['threats'][number]

const columns: ColumnDef<Threat, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  {
    accessorKey: 'severity', header: 'Severity',
    cell: ({ getValue }) => {
        const v = (getValue() as string)?.toLowerCase();
        const intent = v === 'high' ? 'danger' : v === 'medium' ? 'warning' : 'info';
        return <StatusPill label={String(getValue() ?? '')} intent={intent} />;
    },
  },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'detected', header: 'Detected', cell: ({ getValue }) => formatDate(getValue() as string) },
]

export default function DefenderSummary({ data }: { data: DefenderSummaryData }) {
  if (!data.threats.length && !Object.keys(data.summary).length) return null

  const summaryEntries = Object.entries(data.summary)

  return (
    <div className="space-y-6">
      {summaryEntries.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summaryEntries.map(([key, val]) => (
            <div key={key} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="text-sm font-medium text-gray-500 mb-1">{key}</div>
                <div className="text-2xl font-bold text-gray-900">{String(val ?? '')}</div>
            </div>
          ))}
        </div>
      )}
      
      <DataTable 
        title="Defender Threats"
        columns={columns} 
        data={data.threats} 
        pageSize={5}
        renderSubComponent={({ row }) => (
          <div className="text-sm">
             <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto font-mono">
                {JSON.stringify(row, null, 2)}
             </pre>
          </div>
        )}
      />
    </div>
  )
}