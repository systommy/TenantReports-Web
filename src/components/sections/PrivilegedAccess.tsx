import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import Section from '../Section'
import MetricCard from '../MetricCard'
import Badge from '../Badge'
import DataTable from '../tables/DataTable'
import DoughnutChart from '../charts/DoughnutChart'
import { statusStyle } from '../../utils/badges'
import { formatDate } from '../../utils/format'
import type { PrivilegedRoles } from '../../processing/types'

type Assignment = PrivilegedRoles['assignments'][number]
type Activation = PrivilegedRoles['activations'][number]

const assignmentCols: ColumnDef<Assignment, unknown>[] = [
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'principal', header: 'Principal' },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'principal_type', header: 'Principal Type' },
]

const activationCols: ColumnDef<Activation, unknown>[] = [
  { accessorKey: 'timestamp', header: 'Timestamp', cell: ({ getValue }) => formatDate(getValue() as string) },
  { accessorKey: 'activity', header: 'Activity' },
  { accessorKey: 'initiated_by', header: 'Initiated By' },
  { accessorKey: 'target_role', header: 'Target Role' },
  { accessorKey: 'target_user', header: 'Target User' },
  {
    accessorKey: 'result', header: 'Result',
    cell: ({ getValue }) => <Badge label={String(getValue() ?? '')} style={statusStyle(getValue() as string)} />,
  },
  { accessorKey: 'reason', header: 'Reason' },
]

export default function PrivilegedAccess({ data }: { data: PrivilegedRoles }) {
  const [showActivations, setShowActivations] = useState(false)

  if (!data.assignments.length) return null

  const { summary, by_principal_type } = data

  return (
    <Section title="Privileged Access" id="privileged-access">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Total Assignments" value={summary.total} />
        <MetricCard label="Global Admins" value={summary.global_admins} />
        {summary.pim_active_assignments != null && <MetricCard label="PIM Active" value={summary.pim_active_assignments} />}
        {summary.pim_eligible_assignments != null && <MetricCard label="PIM Eligible" value={summary.pim_eligible_assignments} />}
      </div>
      <div className="max-w-xs mx-auto mb-6">
        <DoughnutChart labels={Object.keys(by_principal_type)} values={Object.values(by_principal_type)} title="By Principal Type" />
      </div>
      <DataTable 
        columns={assignmentCols} 
        data={data.assignments} 
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
      {data.activations.length > 0 && (
        <div className="mt-6">
          <button
            className="text-sm font-medium text-blue-600 hover:underline"
            onClick={() => setShowActivations(!showActivations)}
          >
            {showActivations ? '▾ Hide' : '▸ Show'} PIM Activations ({data.activations.length})
          </button>
          {showActivations && (
            <div className="mt-2">
              <DataTable columns={activationCols} data={data.activations} />
            </div>
          )}
        </div>
      )}
    </Section>
  )
}
