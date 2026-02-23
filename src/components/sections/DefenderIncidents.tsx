import type { ColumnDef } from '@tanstack/react-table'
import DataTable from '../tables/DataTable'
import StatusPill from '../common/StatusPill'
import type { DefenderIncidents as DefenderIncidentsData } from '../../processing/types'
import { formatDate } from '../../utils/format'
import BarChart from '../charts/BarChart'

type Incident = DefenderIncidentsData['incidents'][number]

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
        const intent = v === 'active' || v === 'new' ? 'danger' : 'success';
        return <StatusPill label={String(getValue() ?? '')} intent={intent} />;
    },
  },
  {
    accessorKey: 'url',
    header: 'Link',
    cell: ({ getValue }) => {
      const url = getValue() as string;
      return url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
          View ↗
        </a>
      ) : <span className="text-gray-400">-</span>;
    }
  }
]

export default function DefenderIncidents({ data }: { data: DefenderIncidentsData }) {
  if (!data.incidents.length) return null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 h-64">
             <BarChart labels={Object.keys(data.by_severity)} datasets={[{ label: 'Incidents', values: Object.values(data.by_severity) }]} title="By Severity" />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 h-64">
             <BarChart labels={Object.keys(data.by_status)} datasets={[{ label: 'Incidents', values: Object.values(data.by_status) }]} title="By Status" />
        </div>
      </div>
      <DataTable 
        title="Incident List"
        columns={columns} 
        data={data.incidents} 
        renderSubComponent={({ row }) => (
          <div className="space-y-4 text-sm bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="font-semibold text-gray-500 text-xs uppercase block">Classification:</span>
                <p className="mt-1 text-gray-700">{row.classification || 'Unknown'}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-500 text-xs uppercase block">Determination:</span>
                <p className="mt-1 text-gray-700">{row.determination || 'Unknown'}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-500 text-xs uppercase block">Portal Link:</span>
                {row.url ? (
                  <a href={row.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-1 block">
                    View in Defender Portal ↗
                  </a>
                ) : 'N/A'}
              </div>
            </div>
            {row.comments && (
              <div>
                <span className="font-semibold text-gray-500 text-xs uppercase block">Comments:</span>
                <p className="mt-1 text-gray-700 whitespace-pre-wrap">{row.comments}</p>
              </div>
            )}
            <div>
               <span className="font-semibold text-gray-500 text-xs uppercase block mb-1">Raw Data Snippet</span>
               <pre className="bg-white p-2 border rounded text-xs overflow-x-auto">
                  {JSON.stringify({ id: row.incident_id, title: row.title, created: row.created }, null, 2)}
               </pre>
            </div>
          </div>
        )}
      />
    </div>
  )
}