import type { ColumnDef } from '@tanstack/react-table'
import BarChart from '../charts/BarChart'
import DataTable from '../tables/DataTable'
import { pct } from '../../utils/format'
import type { LicenseOverview as LicenseOverviewData, LicenseItem } from '../../processing/types'

const columns: ColumnDef<LicenseItem, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'assigned', header: 'Assigned' },
  { accessorKey: 'available', header: 'Available' },
  {
    accessorKey: 'utilization', header: 'Utilization',
    cell: ({ getValue }) => {
        const val = getValue() as number;
        return (
            <div className="w-full max-w-[140px] flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                        className={`h-full ${val > 0.9 ? 'bg-rose-500' : val > 0.7 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${val * 100}%` }}
                    />
                </div>
                <span className="text-xs font-mono">{pct(val * 100)}</span>
            </div>
        )
    },
  },
]

export default function LicenseOverview({ data }: { data: LicenseOverviewData }) {
  const { licenses } = data
  
  const chartLicenses = [...licenses]
    .filter(l => l.assigned > 0 && l.available < 9000)
    .sort((a, b) => b.assigned - a.assigned)
    .slice(0, 10)

  const chartLabels = chartLicenses.map(l => l.name ?? 'Unknown')
  const assigned = chartLicenses.map(l => l.assigned)
  const available = chartLicenses.map(l => l.available)

  const sortedTableLicenses = [...licenses].sort((a, b) => b.assigned - a.assigned)

  return (
    <div className="space-y-8">
      {chartLabels.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="h-64">
              <BarChart
                labels={chartLabels}
                datasets={[
                  { label: 'Assigned', values: assigned },
                  { label: 'Available', values: available },
                ]}
                title="Top 10 Assigned Licenses"
              />
          </div>
        </div>
      )}
      
      <DataTable 
        title="License Distribution"
        columns={columns} 
        data={sortedTableLicenses} 
        pageSize={10}
      />
    </div>
  )
}