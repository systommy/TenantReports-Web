import type { ColumnDef } from '@tanstack/react-table'
import Section from '../Section'
import MetricCard from '../MetricCard'
import Badge from '../Badge'
import DataTable from '../tables/DataTable'
import { statusStyle, boolStyle, boolLabel } from '../../utils/badges'
import type { PermissionsSummary } from '../../processing/types'

type Perm = PermissionsSummary['permissions'][number]

const columns: ColumnDef<Perm, unknown>[] = [
  { accessorKey: 'mailbox', header: 'Mailbox' },
  { accessorKey: 'user', header: 'User' },
  {
    accessorKey: 'access', header: 'Access Rights',
    cell: ({ getValue }) => <Badge label={String(getValue() ?? '')} style={statusStyle(getValue() as string)} />,
  },
  {
    accessorKey: 'is_inherited', header: 'Inherited',
    cell: ({ getValue }) => <Badge label={boolLabel(getValue())} style={boolStyle(getValue())} />,
  },
]

export default function MailboxPermissions({ data }: { data: PermissionsSummary }) {
  if (!data.permissions.length) return null
  const s = data.summary
  return (
    <Section title="Mailbox Permissions" id="mailbox-permissions">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Total Mailboxes" value={s.total_mailboxes ?? 0} />
        <MetricCard label="Total Permissions" value={s.total_permissions ?? 0} />
        <MetricCard label="Full Access" value={s.full_access ?? 0} />
        <MetricCard label="Send As" value={s.send_as ?? 0} />
      </div>
      <DataTable 
        columns={columns} 
        data={data.permissions} 
        renderSubComponent={({ row }) => (
          <div className="grid grid-cols-2 gap-4 text-sm">
             {Object.entries(row).map(([k, v]) => (
                <div key={k}>
                   <span className="font-semibold text-gray-500 text-xs uppercase">{k}: </span>
                   <span>{String(v)}</span>
                </div>
             ))}
          </div>
        )}
      />
    </Section>
  )
}
