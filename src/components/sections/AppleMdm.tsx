import type { ColumnDef } from '@tanstack/react-table'
import DataTable from '../tables/DataTable'
import StatusPill from '../common/StatusPill'
import { formatDate } from '../../utils/format'
import type { AppleMdm as AppleMdmData } from '../../processing/types'

type Cert = AppleMdmData['certificates'][number]

const columns: ColumnDef<Cert, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'apple_id', header: 'Apple ID' },
  {
    accessorKey: 'status', header: 'Status',
    cell: ({ getValue, row }) => {
        const v = (getValue() as string)?.toLowerCase() ?? '';
        const daysLeft = row.original.days_left;
        
        let intent: 'success' | 'warning' | 'danger' | 'neutral' = 'neutral';
        
        if (v.includes('expired')) {
            intent = 'danger';
        } else if (v.includes('expiring') || v.includes('expiringsoon') || (daysLeft !== null && daysLeft < 30)) {
            intent = 'warning';
        } else if (v.includes('valid') || v.includes('active')) {
            intent = 'success';
        } else {
            intent = 'warning'; // Default fallback for unknown statuses which might be risky
        }
        
        return <StatusPill label={String(getValue() ?? '')} intent={intent} />;
    }
  },
  { accessorKey: 'expiration', header: 'Expiration', cell: ({ getValue }) => formatDate(getValue() as string) },
  { accessorKey: 'days_left', header: 'Days Left' },
]

export default function AppleMdm({ data }: { data: AppleMdmData }) {
  if (!data.certificates.length) return null
  return (
    <DataTable 
      title="Apple MDM Certificates"
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
  )
}