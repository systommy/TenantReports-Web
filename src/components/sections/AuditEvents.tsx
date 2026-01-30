import type { ColumnDef } from '@tanstack/react-table'
import StatusPill from '../common/StatusPill'
import DataTable from '../tables/DataTable'
import { formatDate } from '../../utils/format'
import type { AuditEvents as AuditEventsData } from '../../processing/types'

type GroupEvent = AuditEventsData['group_events'][number]
type UserEvent = AuditEventsData['user_events'][number]

const groupCols: ColumnDef<GroupEvent, unknown>[] = [
  { accessorKey: 'timestamp', header: 'Timestamp', cell: ({ getValue }) => formatDate(getValue() as string) },
  { accessorKey: 'activity', header: 'Activity' },
  { accessorKey: 'target', header: 'Target' },
  { accessorKey: 'initiated_by', header: 'Initiated By' },
  { accessorKey: 'group', header: 'Group' },
  {
    accessorKey: 'status', header: 'Status',
    cell: ({ getValue }) => {
        const v = (getValue() as string)?.toLowerCase();
        const intent = v === 'success' ? 'success' : 'danger';
        return <StatusPill label={String(getValue() ?? '')} intent={intent} />;
    },
  },
]

const userCols: ColumnDef<UserEvent, unknown>[] = [
  { accessorKey: 'timestamp', header: 'Timestamp', cell: ({ getValue }) => formatDate(getValue() as string) },
  { accessorKey: 'activity', header: 'Activity' },
  { accessorKey: 'target', header: 'Target' },
  { accessorKey: 'initiated_by', header: 'Initiated By' },
  {
    accessorKey: 'status', header: 'Status',
    cell: ({ getValue }) => {
        const v = (getValue() as string)?.toLowerCase();
        const intent = v === 'success' ? 'success' : 'danger';
        return <StatusPill label={String(getValue() ?? '')} intent={intent} />;
    },
  },
]

function MetricsGrid({ title, count, topActivity }: { title: string; count: number; topActivity?: { name: string; count: number } }) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
       <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-500 mb-1">Total {title}</div>
          <div className="text-2xl font-bold text-gray-900">{count}</div>
       </div>
       {topActivity && (
         <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Top Activity</div>
            <div className="text-lg font-bold text-gray-900 truncate" title={topActivity.name}>{topActivity.name}</div>
            <div className="text-xs text-gray-500">{topActivity.count} events</div>
         </div>
       )}
    </div>
  )
}

export default function AuditEvents({ data }: { data: AuditEventsData }) {
  if (!data.group_events.length && !data.user_events.length) return null

  const groupTop = Object.entries(data.group_activities).sort((a, b) => b[1] - a[1])[0];
  const userTop = Object.entries(data.user_activities).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-12">
      <div id="group-modifications" className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Group Modifications</h3>
        <MetricsGrid 
          title="Group Events" 
          count={data.group_events.length} 
          topActivity={groupTop ? { name: groupTop[0], count: groupTop[1] } : undefined} 
        />
        <DataTable 
          title="Group Events Log"
          columns={groupCols} 
          data={data.group_events} 
          renderSubComponent={({ row }) => (
            <div className="text-sm">
               <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                  {JSON.stringify(row, null, 2)}
               </pre>
            </div>
          )}
        />
      </div>

      <div id="user-modifications" className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">User Modifications</h3>
        <MetricsGrid 
          title="User Events" 
          count={data.user_events.length} 
          topActivity={userTop ? { name: userTop[0], count: userTop[1] } : undefined} 
        />
        <DataTable 
          title="User Events Log"
          columns={userCols} 
          data={data.user_events} 
          renderSubComponent={({ row }) => (
            <div className="text-sm">
               <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                  {JSON.stringify(row, null, 2)}
               </pre>
            </div>
          )}
        />
      </div>
    </div>
  )
}