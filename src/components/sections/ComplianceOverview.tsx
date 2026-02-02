import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import DataTable from '../tables/DataTable'
import StatusPill from '../common/StatusPill'
import DoughnutChart from '../charts/DoughnutChart'
import { formatDate } from '../../utils/format'
import { Info } from 'lucide-react'
import type { ComplianceOverview as ComplianceOverviewData } from '../../processing/types'

const columns: ColumnDef<Record<string, unknown>, unknown>[] = [
  { accessorKey: 'DeviceName', header: 'Device Name' },
  { accessorKey: 'OperatingSystem', header: 'OS' },
  {
    accessorKey: 'ComplianceState', header: 'Status',
    cell: ({ getValue }) => {
      const v = (getValue() as string) ?? '';
      const intent = v.toLowerCase() === 'compliant' ? 'success' : 'danger';
      return <StatusPill label={v} intent={intent} />;
    },
  },
  { accessorKey: 'UserPrincipalName', header: 'User' },
  {
    accessorKey: 'LastSyncDateTime', header: 'Last Sync',
    cell: ({ getValue }) => formatDate(getValue() as string),
  },
]

function countBy(items: Record<string, unknown>[], key: string): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const item of items) {
    const v = String(item[key] ?? 'Unknown')
    counts[v] = (counts[v] ?? 0) + 1
  }
  return counts
}

export default function ComplianceOverview({ data, devices }: { data: ComplianceOverviewData; devices: Record<string, unknown>[] }) {
  const isEmpty = Object.keys(data.intune).length === 0 && devices.length === 0
  const compliance = useMemo(() => countBy(devices, 'ComplianceState'), [devices])
  const os = useMemo(() => countBy(devices, 'OperatingSystem'), [devices])
  const ownership = useMemo(() => countBy(devices, 'OwnerType'), [devices])

  if (isEmpty) {
    return (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-6 flex items-center gap-3 text-gray-500">
            <Info size={20} />
            <span className="text-sm font-medium">No device compliance data found.</span>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h3 className="font-bold text-gray-900 text-sm mb-4">Compliance Status</h3>
            <DoughnutChart labels={Object.keys(compliance)} values={Object.values(compliance)} title="" />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h3 className="font-bold text-gray-900 text-sm mb-4">OS Distribution</h3>
            <DoughnutChart labels={Object.keys(os)} values={Object.values(os)} title="" />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h3 className="font-bold text-gray-900 text-sm mb-4">Ownership</h3>
            <DoughnutChart labels={Object.keys(ownership)} values={Object.values(ownership)} title="" />
        </div>
      </div>
      <DataTable 
        title="Managed Devices"
        columns={columns} 
        data={devices} 
        renderSubComponent={({ row }) => (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
            {Object.entries(row).map(([k, v]) => (
              <div key={k} className="flex flex-col">
                <span className="font-semibold text-gray-400 text-xs uppercase">{k}</span>
                <span className="break-all font-mono text-xs">{String(v ?? '-')}</span>
              </div>
            ))}
          </div>
        )}
      />
    </div>
  )
}