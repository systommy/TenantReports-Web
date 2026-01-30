import type { ColumnDef } from '@tanstack/react-table'
import DataTable from '../tables/DataTable'
import StatusPill from '../common/StatusPill'
import { formatDate } from '../../utils/format'
import type { AppCredentialExpiry } from '../../processing/types'

const columns: ColumnDef<AppCredentialExpiry, unknown>[] = [
  { accessorKey: 'app_name', header: 'Application' },
  { accessorKey: 'app_id', header: 'App ID' },
  { accessorKey: 'key_id', header: 'Key ID' },
  { accessorKey: 'type', header: 'Type' },
  {
    accessorKey: 'end_date', header: 'Expires',
    cell: ({ getValue }) => formatDate(getValue() as string),
  },
  {
    accessorKey: 'days_until_expiry', header: 'Days Left',
    cell: ({ getValue }) => {
        const val = getValue() as number;
        const intent = val < 30 ? 'danger' : val < 90 ? 'warning' : 'success';
        return <StatusPill label={String(val)} intent={intent} />;
    },
  },
  {
    accessorKey: 'status', header: 'Status',
    cell: ({ getValue }) => {
        const v = (getValue() as string)?.toLowerCase();
        const intent = v === 'expired' ? 'danger' : v === 'expiring' ? 'warning' : 'success';
        return <StatusPill label={String(getValue() ?? '')} intent={intent} />;
    },
  },
]

export default function AppCredentials({ data }: { data: AppCredentialExpiry[] }) {
  if (!data || data.length === 0) return null

  return (
    <DataTable 
        title="App Registration Credentials"
        columns={columns} 
        data={data} 
        pageSize={5}
    />
  )
}
