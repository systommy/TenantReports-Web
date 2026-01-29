import type { ColumnDef } from '@tanstack/react-table'
import Section from '../Section'
import DataTable from '../tables/DataTable'
import Badge from '../Badge'
import { statusStyle } from '../../utils/badges'
import { formatDate } from '../../utils/format'
import type { AppleMdm as AppleMdmData } from '../../processing/types'

type Cert = AppleMdmData['certificates'][number]

const columns: ColumnDef<Cert, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'apple_id', header: 'Apple ID' },
  {
    accessorKey: 'status', header: 'Status',
    cell: ({ getValue }) => <Badge label={String(getValue() ?? '')} style={statusStyle(getValue() as string)} />,
  },
  { accessorKey: 'expiration', header: 'Expiration', cell: ({ getValue }) => formatDate(getValue() as string) },
  { accessorKey: 'days_left', header: 'Days Left' },
]

export default function AppleMdm({ data }: { data: AppleMdmData }) {
  if (!data.certificates.length) return null
  return (
    <Section title="Apple MDM Certificates" id="apple-mdm">
      <DataTable 
        columns={columns} 
        data={data.certificates} 
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
