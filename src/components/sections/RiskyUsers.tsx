import type { ColumnDef } from '@tanstack/react-table'
import DataTable from '../tables/DataTable'
import StatusPill from '../common/StatusPill'
import { formatDate } from '../../utils/format'
import type { RiskyUser } from '../../processing/types'

const columns: ColumnDef<RiskyUser, unknown>[] = [
  { accessorKey: 'user', header: 'User' },
  {
    accessorKey: 'risk_level', header: 'Risk Level',
    cell: ({ getValue }) => {
      const v = (getValue() as string)?.toLowerCase();
      const intent = v === 'high' ? 'danger' : v === 'medium' ? 'warning' : 'info';
      return <StatusPill label={String(getValue() ?? '')} intent={intent} />;
    },
  },
  {
    accessorKey: 'risk_state', header: 'Risk State',
    cell: ({ getValue }) => {
      const v = (getValue() as string)?.toLowerCase();
      const intent = v === 'atrisk' ? 'danger' : v === 'confirmedcompromised' ? 'danger' : v === 'remediated' ? 'success' : 'neutral';
      return <StatusPill label={String(getValue() ?? '')} intent={intent} />;
    },
  },
  { accessorKey: 'last_updated', header: 'Last Updated', cell: ({ getValue }) => formatDate(getValue() as string) },
]

export default function RiskyUsers({ data }: { data: RiskyUser[] }) {
  if (!data.length) return null
  return (
    <DataTable 
      title="Risky Users"
      columns={columns} 
      data={data} 
      renderSubComponent={({ row }) => (
        <div className="text-sm">
           <span className="font-semibold text-gray-500 text-xs uppercase block mb-1">Full Details</span>
           <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
              {JSON.stringify(row, null, 2)}
           </pre>
        </div>
      )}
    />
  )
}
