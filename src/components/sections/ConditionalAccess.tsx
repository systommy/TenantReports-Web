import type { ColumnDef } from '@tanstack/react-table'
import Section from '../Section'
import MetricCard from '../MetricCard'
import Badge from '../Badge'
import DataTable from '../tables/DataTable'
import { statusStyle, boolStyle, boolLabel } from '../../utils/badges'
import { formatDate } from '../../utils/format'
import type { ConditionalAccess as ConditionalAccessData, ConditionalAccessPolicy } from '../../processing/types'

function stringify(val: unknown): string {
  if (val == null) return '—'
  if (Array.isArray(val)) return val.length ? val.join(', ') : '—'
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
}

export default function ConditionalAccess({ data }: { data: ConditionalAccessData }) {
  const { summary } = data

  const columns: ColumnDef<ConditionalAccessPolicy, unknown>[] = [
    { accessorKey: 'name', header: 'Name' },
    {
      accessorKey: 'state', header: 'State',
      cell: ({ getValue }) => <Badge label={String(getValue() ?? '')} style={statusStyle(getValue() as string)} />,
    },
    {
      accessorKey: 'requires_mfa', header: 'Requires MFA',
      cell: ({ getValue }) => <Badge label={boolLabel(getValue())} style={boolStyle(getValue())} />,
    },
    {
      accessorKey: 'blocks_access', header: 'Blocks Access',
      cell: ({ getValue }) => <Badge label={boolLabel(getValue())} style={boolStyle(getValue())} />,
    },
    {
      accessorKey: 'covers_all_users', header: 'Covers All Users',
      cell: ({ getValue }) => <Badge label={boolLabel(getValue())} style={boolStyle(getValue())} />,
    },
    { accessorKey: 'created_date', header: 'Created', cell: ({ getValue }) => formatDate(getValue() as string) },
  ]

  return (
    <Section title="Conditional Access Policies" id="conditional-access">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Total Policies" value={summary.total_policies} />
        <MetricCard label="Enabled" value={summary.enabled} />
        <MetricCard label="Disabled" value={summary.disabled} />
        <MetricCard label="Report Only" value={summary.report_only} />
      </div>
      <DataTable 
        columns={columns} 
        data={data.policies} 
        renderSubComponent={({ row }) => (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-sm">
              <div className="space-y-1">
                <span className="font-semibold text-gray-500 text-xs uppercase block">Grant Controls</span>
                <p className="text-gray-700">{stringify(row.grant_controls)}</p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-gray-500 text-xs uppercase block">Session Controls</span>
                <p className="text-gray-700">{stringify(row.session_controls)}</p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-gray-500 text-xs uppercase block">Platforms</span>
                <p className="text-gray-700">{stringify(row.platforms)}</p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-gray-500 text-xs uppercase block">Client App Types</span>
                <p className="text-gray-700">{stringify(row.client_app_types)}</p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-gray-500 text-xs uppercase block">Included Users/Groups</span>
                <p className="text-gray-700">{stringify(row.included_users)}, {stringify(row.included_groups)}</p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-gray-500 text-xs uppercase block">Excluded Users/Groups</span>
                <p className="text-gray-700">{stringify(row.excluded_users)}, {stringify(row.excluded_groups)}</p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-gray-500 text-xs uppercase block">Included Applications</span>
                <p className="text-gray-700">{stringify(row.included_applications)}</p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-gray-500 text-xs uppercase block">Included Locations</span>
                <p className="text-gray-700">{stringify(row.included_locations)}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
                <span className="font-semibold text-gray-500 text-xs uppercase block mb-2">Full Policy Object</span>
                <pre className="bg-gray-100 p-3 rounded-lg text-xs overflow-x-auto max-h-60">
                  {JSON.stringify(row, null, 2)}
                </pre>
            </div>
          </div>
        )}
      />
    </Section>
  )
}