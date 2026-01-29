import type { ColumnDef } from '@tanstack/react-table'
import Section from '../Section'
import DataTable from '../tables/DataTable'
import Badge from '../Badge'
import { severityStyle, statusStyle } from '../../utils/badges'
import { formatDate } from '../../utils/format'
import type { RiskyUser } from '../../processing/types'

const columns: ColumnDef<RiskyUser, unknown>[] = [
  { accessorKey: 'user', header: 'User' },
  {
    accessorKey: 'risk_level', header: 'Risk Level',
    cell: ({ getValue }) => <Badge label={String(getValue() ?? '')} style={severityStyle(getValue() as string)} />,
  },
  {
    accessorKey: 'risk_state', header: 'Risk State',
    cell: ({ getValue }) => <Badge label={String(getValue() ?? '')} style={statusStyle(getValue() as string)} />,
  },
  { accessorKey: 'last_updated', header: 'Last Updated', cell: ({ getValue }) => formatDate(getValue() as string) },
]

export default function RiskyUsers({ data }: { data: RiskyUser[] }) {
  if (!data.length) return null
  return (
    <Section title="Risky Users" id="risky-users">
      <DataTable 
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
    </Section>
  )
}
