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

export default function AuditEvents({ data }: { data: AuditEventsData }) {
  if (!data.group_events.length && !data.user_events.length) return null

  const topActivities = [
    ...Object.entries(data.group_activities).slice(0, 3),
    ...Object.entries(data.user_activities).slice(0, 3),
  ]

  return (
    <div className="space-y-8">
      {topActivities.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {topActivities.map(([key, val]) => (
            <div key={key} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="text-xs font-bold uppercase text-gray-500 mb-1 truncate" title={key}>{key}</div>
                <div className="text-2xl font-bold text-gray-900">{val}</div>
            </div>
          ))}
        </div>
      )}
      
      <DataTable 
        title="Group Modifications"
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

      <DataTable 
        title="User Modifications"
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
  )
}