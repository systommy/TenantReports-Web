import type { ColumnDef } from '@tanstack/react-table'
import Section from '../Section'
import MetricCard from '../MetricCard'
import DataTable from '../tables/DataTable'
import type { PermissionsSummary } from '../../processing/types'

type Perm = PermissionsSummary['permissions'][number]

const columns: ColumnDef<Perm, unknown>[] = [
  { accessorKey: 'mailbox', header: 'Mailbox' },
  { accessorKey: 'user', header: 'User' },
  { accessorKey: 'access', header: 'Access Rights' },
  { accessorKey: 'folder', header: 'Folder' },
]

export default function CalendarPermissions({ data }: { data: PermissionsSummary }) {
  if (!data.permissions.length) return null
  const s = data.summary
  return (
    <Section title="Calendar Permissions" id="calendar-permissions">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Total Calendars" value={s.total_calendars ?? 0} />
        <MetricCard label="Total Permissions" value={s.total_permissions ?? 0} />
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
