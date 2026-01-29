import type { ColumnDef } from '@tanstack/react-table'
import Section from '../Section'
import MetricCard from '../MetricCard'
import Badge from '../Badge'
import DataTable from '../tables/DataTable'
import { severityStyle } from '../../utils/badges'
import { formatDate } from '../../utils/format'
import type { DefenderSummary as DefenderSummaryData } from '../../processing/types'

type Threat = DefenderSummaryData['threats'][number]

const columns: ColumnDef<Threat, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  {
    accessorKey: 'severity', header: 'Severity',
    cell: ({ getValue }) => <Badge label={String(getValue() ?? '')} style={severityStyle(getValue() as string)} />,
  },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'detected', header: 'Detected', cell: ({ getValue }) => formatDate(getValue() as string) },
]

export default function DefenderSummary({ data }: { data: DefenderSummaryData }) {
  if (!data.threats.length && !Object.keys(data.summary).length) return null

  const summaryEntries = Object.entries(data.summary)

  return (
    <Section title="Defender Summary" id="defender-summary">
      {summaryEntries.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {summaryEntries.map(([key, val]) => (
            <MetricCard key={key} label={key} value={String(val ?? '')} />
          ))}
        </div>
      )}
      <DataTable 
        columns={columns} 
        data={data.threats} 
        renderSubComponent={({ row }) => (
          <div className="text-sm">
             <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                {JSON.stringify(row, null, 2)}
             </pre>
          </div>
        )}
      />

    </Section>
  )
}
