import type { ColumnDef } from '@tanstack/react-table'
import DataTable from '../tables/DataTable'
import StatusPill from '../common/StatusPill'
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
      cell: ({ getValue }) => {
        const v = (getValue() as string)?.toLowerCase();
        const intent = v === 'enabled' ? 'success' : v === 'disabled' ? 'neutral' : 'warning';
        return <StatusPill label={String(getValue() ?? '')} intent={intent} />;
      },
    },
    {
      accessorKey: 'requires_mfa', header: 'Requires MFA',
      cell: ({ getValue }) => <StatusPill label={getValue() ? 'Yes' : 'No'} intent={getValue() ? 'success' : 'neutral'} />,
    },
    {
      accessorKey: 'blocks_access', header: 'Blocks Access',
      cell: ({ getValue }) => <StatusPill label={getValue() ? 'Yes' : 'No'} intent={getValue() ? 'danger' : 'neutral'} />,
    },
    {
      accessorKey: 'covers_all_users', header: 'Covers All Users',
      cell: ({ getValue }) => <StatusPill label={getValue() ? 'Yes' : 'No'} intent={getValue() ? 'info' : 'neutral'} />,
    },
    { accessorKey: 'created_date', header: 'Created', cell: ({ getValue }) => formatDate(getValue() as string) },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Total Policies</div>
            <div className="text-2xl font-bold text-gray-900">{summary.total_policies}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Enabled</div>
            <div className="text-2xl font-bold text-emerald-600">{summary.enabled}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Disabled</div>
            <div className="text-2xl font-bold text-gray-400">{summary.disabled}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Report Only</div>
            <div className="text-2xl font-bold text-amber-500">{summary.report_only}</div>
        </div>
      </div>
      <DataTable 
        title="Policy List"
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
                <pre className="bg-gray-100 p-3 rounded-lg text-xs overflow-x-auto max-h-60 font-mono">
                  {JSON.stringify(row, null, 2)}
                </pre>
            </div>
          </div>
        )}
      />
    </div>
  )
}
