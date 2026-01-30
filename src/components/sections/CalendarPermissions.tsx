import type { ColumnDef } from '@tanstack/react-table'
import DataTable from '../tables/DataTable'
import StatusPill from '../common/StatusPill'
import { Calendar, Shield } from 'lucide-react'
import type { PermissionsSummary } from '../../processing/types'

type Perm = PermissionsSummary['permissions'][number]

const columns: ColumnDef<Perm, unknown>[] = [
  { accessorKey: 'mailbox', header: 'Mailbox' },
  { accessorKey: 'user', header: 'User' },
  { 
    accessorKey: 'access', header: 'Access Rights',
    cell: ({ getValue }) => {
        const v = String(getValue() ?? '');
        const intent = v.includes('Owner') || v.includes('Editor') ? 'danger' : 
                      v.includes('Reviewer') ? 'warning' : 'neutral';
        return <StatusPill label={v} intent={intent} />;
    }
  },
  { accessorKey: 'folder', header: 'Folder' },
]

function MetricCard({ title, value, colorClass, bgClass, icon: Icon }: { title: string; value: number | string; colorClass: string; bgClass: string; icon: any }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-start justify-between group hover:border-indigo-200 transition-colors">
            <div>
                <div className="text-sm font-medium text-gray-500 mb-1">{title}</div>
                <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
            </div>
            <div className={`p-2 rounded-lg ${bgClass} ${colorClass}`}>
                <Icon size={20} />
            </div>
        </div>
    )
}

export default function CalendarPermissions({ data }: { data: PermissionsSummary }) {
  if (!data.permissions.length) return null
  const s = data.summary
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard title="Total Calendars" value={s.total_calendars ?? 0} colorClass="text-gray-900" bgClass="bg-gray-100" icon={Calendar} />
        <MetricCard title="Total Permissions" value={s.total_permissions ?? 0} colorClass="text-gray-900" bgClass="bg-gray-100" icon={Shield} />
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