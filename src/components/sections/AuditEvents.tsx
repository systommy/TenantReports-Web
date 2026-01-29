import type { ColumnDef } from '@tanstack/react-table'
import Section from '../Section'
import MetricCard from '../MetricCard'
import Badge from '../Badge'
import DataTable from '../tables/DataTable'
import { statusStyle } from '../../utils/badges'
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
    cell: ({ getValue }) => <Badge label={String(getValue() ?? '')} style={statusStyle(getValue() as string)} />,
  },
]

const userCols: ColumnDef<UserEvent, unknown>[] = [
  { accessorKey: 'timestamp', header: 'Timestamp', cell: ({ getValue }) => formatDate(getValue() as string) },
  { accessorKey: 'activity', header: 'Activity' },
  { accessorKey: 'target', header: 'Target' },
  { accessorKey: 'initiated_by', header: 'Initiated By' },
  {
    accessorKey: 'status', header: 'Status',
    cell: ({ getValue }) => <Badge label={String(getValue() ?? '')} style={statusStyle(getValue() as string)} />,
  },
]

export default function AuditEvents({ data }: { data: AuditEventsData }) {
  if (!data.group_events.length && !data.user_events.length) return null

  const topActivities = [
    ...Object.entries(data.group_activities).slice(0, 3),
    ...Object.entries(data.user_activities).slice(0, 3),
  ]

  return (
    <Section title="Audit Events" id="audit-events">
      {topActivities.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {topActivities.map(([key, val]) => (
            <MetricCard key={key} label={key} value={val} />
          ))}
        </div>
      )}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Group Modifications</h3>
        <DataTable 
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

      <div>
        <h3 className="text-lg font-semibold mb-3">User Modifications</h3>
        <DataTable 
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

    </Section>
  )
}
