import type { ColumnDef } from '@tanstack/react-table'
import Section from '../Section'
import MetricCard from '../MetricCard'
import Badge from '../Badge'
import DataTable from '../tables/DataTable'
import BarChart from '../charts/BarChart'
import { severityStyle, statusStyle } from '../../utils/badges'
import { formatDate } from '../../utils/format'
import type { SentinelIncidents as SentinelIncidentsData } from '../../processing/types'

type Incident = SentinelIncidentsData['incidents'][number]

const columns: ColumnDef<Incident, unknown>[] = [
  { accessorKey: 'created', header: 'Created', cell: ({ getValue }) => formatDate(getValue() as string) },
  { accessorKey: 'incident_id', header: 'ID' },
  { accessorKey: 'title', header: 'Title' },
  {
    accessorKey: 'severity', header: 'Severity',
    cell: ({ getValue }) => <Badge label={String(getValue() ?? '')} style={severityStyle(getValue() as string)} />,
  },
  {
    accessorKey: 'status', header: 'Status',
    cell: ({ getValue }) => <Badge label={String(getValue() ?? '')} style={statusStyle(getValue() as string)} />,
  },
  { accessorKey: 'classification', header: 'Classification' },
  { accessorKey: 'comments', header: 'Comments' },
]

export default function SentinelIncidents({ data }: { data: SentinelIncidentsData }) {
  if (data.total === 0) return null

  return (
    <Section title="Sentinel Incidents" id="sentinel-incidents">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Total Incidents" value={data.total} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <BarChart labels={Object.keys(data.by_severity)} datasets={[{ label: 'Incidents', values: Object.values(data.by_severity) }]} title="By Severity" />
        <BarChart labels={Object.keys(data.by_status)} datasets={[{ label: 'Incidents', values: Object.values(data.by_status) }]} title="By Status" />
      </div>
      <DataTable 
        columns={columns} 
        data={data.incidents} 
        renderSubComponent={({ row }) => (
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-semibold text-gray-500 text-xs uppercase">Description/Comments:</span>
              <p className="mt-1 text-gray-700 whitespace-pre-wrap">{row.comments || 'No comments available.'}</p>
            </div>
            <div className="mt-2">
               <span className="font-semibold text-gray-500 text-xs uppercase block mb-1">Raw Data</span>
               <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                  {JSON.stringify(row, null, 2)}
               </pre>
            </div>
          </div>
        )}
      />
    </Section>
  )
}
