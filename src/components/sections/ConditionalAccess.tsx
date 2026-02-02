import type { ColumnDef } from '@tanstack/react-table'
import DataTable from '../tables/DataTable'
import StatusPill from '../common/StatusPill'
import { FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import type { ConditionalAccess as ConditionalAccessData, ConditionalAccessPolicy } from '../../processing/types'

function stringify(val: unknown): string {
  if (val == null) return '—'
  if (Array.isArray(val)) return val.length ? val.join(', ') : '—'
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
}

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

export default function ConditionalAccess({ data }: { data: ConditionalAccessData }) {
  const { summary } = data

  const columns: ColumnDef<ConditionalAccessPolicy, unknown>[] = [
    { accessorKey: 'name', header: 'Name' },
    {
      accessorKey: 'state', header: 'State',
      cell: ({ getValue }) => {
        const v = (getValue() as string) ?? '';
        const lower = v.toLowerCase();
        
        let label = v;
        let intent: 'success' | 'danger' | 'warning' | 'neutral' = 'neutral';

        if (lower === 'enabled') {
            intent = 'success';
        } else if (lower === 'disabled') {
            intent = 'danger';
        } else if (lower === 'enabledforreportingbutnotenforced') {
            label = 'ReportOnly';
            intent = 'warning';
        } else {
            intent = 'warning';
        }
        
        return <StatusPill label={label} intent={intent} />;
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
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Policies" value={summary.total_policies} colorClass="text-gray-900" bgClass="bg-gray-100" icon={FileText} />
        <MetricCard title="Enabled" value={summary.enabled} colorClass="text-emerald-600" bgClass="bg-emerald-50" icon={CheckCircle} />
        <MetricCard title="Disabled" value={summary.disabled} colorClass="text-rose-600" bgClass="bg-rose-50" icon={XCircle} />
        <MetricCard title="Report Only" value={summary.report_only} colorClass="text-amber-600" bgClass="bg-amber-50" icon={AlertCircle} />
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
