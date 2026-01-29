import type { ColumnDef } from '@tanstack/react-table'
import DataTable from '../tables/DataTable'
import StatusPill from '../common/StatusPill'
import type { PermissionsSummary } from '../../processing/types'

type Perm = PermissionsSummary['permissions'][number]

const columns: ColumnDef<Perm, unknown>[] = [
  { accessorKey: 'mailbox', header: 'Mailbox' },
  { accessorKey: 'user', header: 'User' },
  {
    accessorKey: 'access', header: 'Access Rights',
    cell: ({ getValue }) => {
        const v = getValue() as string;
        const intent = v.includes('FullAccess') ? 'danger' : 'neutral';
        return <StatusPill label={v ?? ''} intent={intent} />;
    },
  },
  {
    accessorKey: 'is_inherited', header: 'Inherited',
    cell: ({ getValue }) => <StatusPill label={getValue() ? 'Yes' : 'No'} intent={getValue() ? 'neutral' : 'info'} />,
  },
]

export default function MailboxPermissions({ data }: { data: PermissionsSummary }) {
  if (!data.permissions.length) return null
  const s = data.summary
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Total Mailboxes</div>
            <div className="text-2xl font-bold text-gray-900">{s.total_mailboxes ?? 0}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Total Permissions</div>
            <div className="text-2xl font-bold text-gray-900">{s.total_permissions ?? 0}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Full Access</div>
            <div className="text-2xl font-bold text-red-600">{s.full_access ?? 0}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Send As</div>
            <div className="text-2xl font-bold text-amber-600">{s.send_as ?? 0}</div>
        </div>
      </div>
      <DataTable 
        title="Mailbox Permissions"
        columns={columns} 
        data={data.permissions} 
        renderSubComponent={({ row }) => (
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
             {Object.entries(row).map(([k, v]) => (
                <div key={k}>
                   <span className="font-semibold text-gray-400 text-xs uppercase">{k}: </span>
                   <span>{String(v)}</span>
                </div>
             ))}
          </div>
        )}
      />
    </div>
  )
}