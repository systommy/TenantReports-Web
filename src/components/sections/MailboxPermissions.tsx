import type { ColumnDef } from '@tanstack/react-table'
import DataTable from '../tables/DataTable'
import StatusPill from '../common/StatusPill'
import { Mail, Shield, UserCheck, Send } from 'lucide-react'
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

function MetricCard({ title, value, colorClass, icon: Icon }: { title: string; value: number | string; colorClass: string; icon: any }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-start justify-between">
            <div>
                <div className="text-sm font-medium text-gray-500 mb-1">{title}</div>
                <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
            </div>
            <div className={`p-2 rounded-lg bg-gray-50 text-gray-500`}>
                <Icon size={20} />
            </div>
        </div>
    )
}

export default function MailboxPermissions({ data }: { data: PermissionsSummary }) {
  if (!data.permissions.length) return null
  const s = data.summary
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Total Mailboxes" value={s.total_mailboxes ?? 0} colorClass="text-gray-900" icon={Mail} />
        <MetricCard title="Total Permissions" value={s.total_permissions ?? 0} colorClass="text-gray-900" icon={Shield} />
        <MetricCard title="Full Access" value={s.full_access ?? 0} colorClass="text-red-600" icon={UserCheck} />
        <MetricCard title="Send As" value={s.send_as ?? 0} colorClass="text-amber-600" icon={Send} />
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