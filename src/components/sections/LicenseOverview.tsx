import type { ColumnDef } from '@tanstack/react-table'
import Section from '../Section'
import MetricCard from '../MetricCard'
import BarChart from '../charts/BarChart'
import DataTable from '../tables/DataTable'
import { pct } from '../../utils/format'
import type { LicenseOverview as LicenseOverviewData, LicenseItem } from '../../processing/types'

const columns: ColumnDef<LicenseItem, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'sku', header: 'SKU' },
  { accessorKey: 'assigned', header: 'Assigned' },
  { accessorKey: 'available', header: 'Available' },
  {
    accessorKey: 'utilization', header: 'Utilization',
    cell: ({ getValue }) => pct(getValue() as number),
  },
]

export default function LicenseOverview({ data }: { data: LicenseOverviewData }) {
  const { summary, licenses } = data
  const chartLabels = licenses.map(l => l.name ?? 'Unknown')
  const assigned = licenses.map(l => l.assigned)
  const available = licenses.map(l => l.available)

  return (
    <Section title="License Overview" id="license-overview">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <MetricCard label="Total Subscriptions" value={summary.total_subscriptions} />
        <MetricCard label="Active Subscriptions" value={summary.active_subscriptions} />
        <MetricCard label="Purchased" value={summary.licenses_purchased} />
        <MetricCard label="Assigned" value={summary.licenses_assigned} />
        <MetricCard label="Available" value={summary.licenses_available} />
        <MetricCard label="Utilization" value={pct(summary.overall_utilization)} />
      </div>
      {chartLabels.length > 0 && (
        <div className="mb-6">
          <BarChart
            labels={chartLabels}
            datasets={[
              { label: 'Assigned', values: assigned },
              { label: 'Available', values: available },
            ]}
            title="License Distribution"
          />
        </div>
      )}
      <DataTable columns={columns} data={licenses} />
    </Section>
  )
}
