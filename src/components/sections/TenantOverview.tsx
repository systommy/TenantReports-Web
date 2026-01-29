import type { ColumnDef } from '@tanstack/react-table'
import Section from '../Section'
import MetricCard from '../MetricCard'
import Badge from '../Badge'
import DataTable from '../tables/DataTable'
import { boolStyle, boolLabel } from '../../utils/badges'
import { formatDate } from '../../utils/format'
import type { TenantOverview as TenantOverviewData, Domain } from '../../processing/types'

const columns: ColumnDef<Domain, unknown>[] = [
  { accessorKey: 'domain', header: 'Domain' },
  {
    accessorKey: 'is_default', header: 'Default',
    cell: ({ getValue }) => <Badge label={boolLabel(getValue())} style={boolStyle(getValue())} />,
  },
  {
    accessorKey: 'is_initial', header: 'Initial',
    cell: ({ getValue }) => <Badge label={boolLabel(getValue())} style={boolStyle(getValue())} />,
  },
  {
    accessorKey: 'is_verified', header: 'Verified',
    cell: ({ getValue }) => <Badge label={boolLabel(getValue())} style={boolStyle(getValue())} />,
  },
  { accessorKey: 'authentication_type', header: 'Auth Type' },
]

export default function TenantOverview({ data, domains }: { data: TenantOverviewData; domains: Domain[] }) {
  return (
    <Section title="Tenant Overview" id="tenant-overview">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Organization" value={data.organization_name} />
        <MetricCard label="Primary Domain" value={data.primary_domain} />
        <MetricCard label="Domains" value={data.domains_total} />
        <MetricCard label="Generated Date" value={formatDate(data.generation_date)} />
      </div>
      <DataTable columns={columns} data={domains} />
    </Section>
  )
}
