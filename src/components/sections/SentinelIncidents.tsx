import type { ColumnDef } from '@tanstack/react-table'
import StatusPill from '../common/StatusPill'
import DataTable from '../tables/DataTable'
import BarChart from '../charts/BarChart'
import { formatDate } from '../../utils/format'
import type { SentinelIncidents as SentinelIncidentsData } from '../../processing/types'

type Incident = SentinelIncidentsData['incidents'][number]

const columns: ColumnDef<Incident, unknown>[] = [
  { accessorKey: 'created', header: 'Created', cell: ({ getValue }) => formatDate(getValue() as string) },
  { accessorKey: 'incident_id', header: 'ID' },
  { accessorKey: 'title', header: 'Title' },
  {
    accessorKey: 'severity', header: 'Severity',
    cell: ({ getValue }) => {
        const v = (getValue() as string)?.toLowerCase();
        const intent = v === 'high' ? 'danger' : v === 'medium' ? 'warning' : 'info';
        return <StatusPill label={String(getValue() ?? '')} intent={intent} />;
    },
  },
  {
    accessorKey: 'status', header: 'Status',
    cell: ({ getValue }) => {
        const v = (getValue() as string)?.toLowerCase();
        const intent = v === 'new' ? 'danger' : v === 'active' ? 'warning' : 'neutral';
        return <StatusPill label={String(getValue() ?? '')} intent={intent} />;
    },
  },
  { accessorKey: 'classification', header: 'Classification' },
]

export default function SentinelIncidents({ data }: { data: SentinelIncidentsData }) {
  if (data.total === 0) return null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
             <BarChart labels={Object.keys(data.by_severity)} datasets={[{ label: 'Incidents', values: Object.values(data.by_severity) }]} title="By Severity" />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
             <BarChart labels={Object.keys(data.by_status)} datasets={[{ label: 'Incidents', values: Object.values(data.by_status) }]} title="By Status" />
        </div>
      </div>
      <DataTable 
        title="Incident List"
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
    </div>
  )
}