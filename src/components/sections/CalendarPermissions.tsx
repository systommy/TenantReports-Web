import type { ColumnDef } from '@tanstack/react-table'
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
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Total Calendars</div>
            <div className="text-2xl font-bold text-gray-900">{s.total_calendars ?? 0}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Total Permissions</div>
            <div className="text-2xl font-bold text-gray-900">{s.total_permissions ?? 0}</div>
        </div>
      </div>
      <DataTable 
        title="Calendar Permissions"
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