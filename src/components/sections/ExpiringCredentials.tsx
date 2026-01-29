import type { ColumnDef } from '@tanstack/react-table'
import DataTable from '../tables/DataTable'
import StatusPill from '../common/StatusPill'
import { formatDate } from '../../utils/format'
import type { ServicePrincipals } from '../../processing/types'

type Credential = ServicePrincipals['expiring_credentials'][number]

const columns: ColumnDef<Credential, unknown>[] = [
  { accessorKey: 'name', header: 'Application' },
  { accessorKey: 'app_id', header: 'App ID' },
  { accessorKey: 'type', header: 'Type' },
  {
    accessorKey: 'expires_on', header: 'Expires',
    cell: ({ getValue }) => {
        const date = new Date(getValue() as string);
        const now = new Date();
        const daysLeft = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const intent = daysLeft < 7 ? 'danger' : daysLeft < 30 ? 'warning' : 'neutral';
        
        return (
            <div className="flex items-center gap-2">
                <span>{formatDate(getValue() as string)}</span>
                <StatusPill label={`${daysLeft} days`} intent={intent} size="xs" />
            </div>
        )
    },
  },
]

export default function ExpiringCredentials({ credentials }: { credentials: ServicePrincipals['expiring_credentials'] }) {
  if (!credentials || credentials.length === 0) return null

  return (
    <DataTable 
        title="Expiring Credentials"
        columns={columns} 
        data={credentials} 
        pageSize={5}
    />
  )
}