import type { ColumnDef } from '@tanstack/react-table'
import DataTable from '../tables/DataTable'
import StatusPill from '../common/StatusPill'
import { boolLabel } from '../../utils/badges'
import { formatDate } from '../../utils/format'
import type { TenantOverview as TenantOverviewData, Domain } from '../../processing/types'

const columns: ColumnDef<Domain, unknown>[] = [
  { accessorKey: 'domain', header: 'Domain' },
  {
    accessorKey: 'is_default', header: 'Default',
    cell: ({ getValue }) => <StatusPill label={boolLabel(getValue())} intent={getValue() ? 'info' : 'neutral'} />,
  },
  {
    accessorKey: 'is_initial', header: 'Initial',
    cell: ({ getValue }) => <StatusPill label={boolLabel(getValue())} intent={getValue() ? 'info' : 'neutral'} />,
  },
  {
    accessorKey: 'is_verified', header: 'Verified',
    cell: ({ getValue }) => <StatusPill label={boolLabel(getValue())} intent={getValue() ? 'success' : 'warning'} />,
  },
  { accessorKey: 'authentication_type', header: 'Auth Type' },
]

export default function TenantOverview({ data, domains }: { data: TenantOverviewData; domains: Domain[] }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Organization</div>
            <div className="text-lg font-bold text-gray-900 truncate" title={data.organization_name}>{data.organization_name}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Primary Domain</div>
            <div className="text-lg font-bold text-gray-900 truncate" title={data.primary_domain}>{data.primary_domain}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Total Domains</div>
            <div className="text-lg font-bold text-gray-900">{data.domains_total}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Generated Date</div>
            <div className="text-lg font-bold text-gray-900">{formatDate(data.generation_date)}</div>
        </div>
      </div>
      <DataTable 
        title="Domains"
        columns={columns} 
        data={domains} 
      />
    </div>
  )
}