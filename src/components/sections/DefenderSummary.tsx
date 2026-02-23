import type { ColumnDef } from '@tanstack/react-table'
import DataTable from '../tables/DataTable'
import StatusPill from '../common/StatusPill'
import { formatDate } from '../../utils/format'
import type { DefenderSummary as DefenderSummaryData } from '../../processing/types'
import BarChart from '../charts/BarChart'

type Alert = DefenderSummaryData['alerts'][number]

const columns: ColumnDef<Alert, unknown>[] = [
  { accessorKey: 'created', header: 'Created', cell: ({ getValue }) => formatDate(getValue() as string) },
  { accessorKey: 'title', header: 'Alert Title' },
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
  { accessorKey: 'user_count', header: 'Users' },
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

export default function DefenderSummary({ data }: { data: DefenderSummaryData }) {
  if (!data.alerts.length && !Object.keys(data.summary).length) {
    return (
      <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 p-8 text-center">
        <div className="text-gray-500 font-medium">No threats detected</div>
        <div className="text-xs text-gray-400 mt-1">Microsoft Defender for Email found no active threats or alerts.</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 h-64">
             <BarChart labels={Object.keys(data.by_severity)} datasets={[{ label: 'Alerts', values: Object.values(data.by_severity) }]} title="By Severity" />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 h-64">
             <BarChart labels={Object.keys(data.by_status)} datasets={[{ label: 'Alerts', values: Object.values(data.by_status) }]} title="By Status" />
        </div>
      </div>
      
      <DataTable 
        title="Email Threat Alerts"
        columns={columns} 
        data={data.alerts} 
        pageSize={10}
        renderSubComponent={({ row }) => (
          <div className="text-sm p-4 space-y-3 bg-gray-50 rounded-lg">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-bold text-xs text-gray-500 uppercase">Category:</span>
                  <p className="mt-1">{row.category || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-bold text-xs text-gray-500 uppercase">ID:</span>
                  <p className="mt-1">{row.id}</p>
                </div>
             </div>
             <div>
               <span className="font-bold text-xs text-gray-500 uppercase">Affected User(s):</span>
               <p className="mt-1 text-gray-700 break-all">{row.affected_users || 'None listed'}</p>
             </div>
             <div>
               <span className="font-bold text-xs text-gray-500 uppercase">Description:</span>
               <p className="mt-1 text-gray-700 whitespace-pre-wrap">{row.description}</p>
             </div>
             {row.url && (
               <div>
                  <a 
                    href={row.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1"
                  >
                    View in Microsoft Defender Portal ↗
                  </a>
               </div>
             )}
          </div>
        )}
      />
    </div>
  )
}