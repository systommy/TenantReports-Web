import { useState, useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import DataTable from '../tables/DataTable'
import StatusPill from '../common/StatusPill'
import DoughnutChart from '../charts/DoughnutChart'
import ExpandableStatCard from '../common/ExpandableStatCard'
import { formatDate } from '../../utils/format'
import { Info, Laptop, CheckCircle, AlertCircle, CalendarX, Clock, Smartphone } from 'lucide-react'
import type { ComplianceOverview as ComplianceOverviewData } from '../../processing/types'

const columns: ColumnDef<Record<string, unknown>, unknown>[] = [
  { accessorKey: 'DeviceName', header: 'Device Name' },
  { accessorKey: 'OperatingSystem', header: 'OS' },
  {
    accessorKey: 'ComplianceState', header: 'Status',
    cell: ({ getValue }) => {
      const v = (getValue() as string) ?? '';
      const lowV = v.toLowerCase();
      const intent = lowV === 'compliant' ? 'success' : lowV === 'ingraceperiod' ? 'warning' : 'danger';
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
  const [filter, setFilter] = useState<string | null>(null)

  const isEmpty = Object.keys(data.intune).length === 0 && devices.length === 0
  const compliance = useMemo(() => countBy(devices, 'ComplianceState'), [devices])
  const os = useMemo(() => countBy(devices, 'OperatingSystem'), [devices])
  const ownership = useMemo(() => countBy(devices, 'OwnerType'), [devices])

  // Calculate Metrics
  const metrics = useMemo(() => {
    const total = devices.length
    const compliant = devices.filter(d => String(d.ComplianceState).toLowerCase() === 'compliant').length
    const nonCompliant = devices.filter(d => String(d.ComplianceState).toLowerCase() === 'noncompliant').length
    const pending = devices.filter(d => String(d.ComplianceState).toLowerCase() === 'ingraceperiod').length
    
    const windows = devices.filter(d => String(d.OperatingSystem).toLowerCase().includes('windows')).length
    const ios = devices.filter(d => String(d.OperatingSystem).toLowerCase() === 'ios').length
    const android = devices.filter(d => String(d.OperatingSystem).toLowerCase() === 'android').length

    const now = new Date()
    const inactive = devices.filter(d => {
        if (!d.LastSyncDateTime) return false
        const lastSync = new Date(String(d.LastSyncDateTime))
        if (isNaN(lastSync.getTime())) return false
        const diffTime = Math.abs(now.getTime() - lastSync.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays > 30
    }).length

    return { total, compliant, nonCompliant, pending, inactive, windows, ios, android }
  }, [devices])

  // Filter Logic
  const filteredDevices = useMemo(() => {
      if (!filter) return devices
      
      const lowerFilter = filter.toLowerCase()

      if (filter === 'Inactive') {
          const now = new Date()
          return devices.filter(d => {
              if (!d.LastSyncDateTime) return false
              const lastSync = new Date(String(d.LastSyncDateTime))
              if (isNaN(lastSync.getTime())) return false
              const diffTime = Math.abs(now.getTime() - lastSync.getTime())
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
              return diffDays > 30
          })
      }

      if (filter === 'Pending') {
          return devices.filter(d => String(d.ComplianceState).toLowerCase() === 'ingraceperiod')
      }

      if (['Windows', 'iOS', 'Android'].includes(filter)) {
          return devices.filter(d => String(d.OperatingSystem).toLowerCase().includes(lowerFilter))
      }

      return devices.filter(d => String(d.ComplianceState).toLowerCase() === lowerFilter)
  }, [devices, filter])

  const filters = [
      { label: 'All', count: metrics.total, key: null, icon: Laptop },
      { label: 'Compliant', count: metrics.compliant, key: 'Compliant', icon: CheckCircle },
      { label: 'Noncompliant', count: metrics.nonCompliant, key: 'Noncompliant', icon: AlertCircle },
      { label: 'Pending', count: metrics.pending, key: 'Pending', icon: Clock },
      { label: 'Windows', count: metrics.windows, key: 'Windows', icon: Laptop },
      { label: 'iOS', count: metrics.ios, key: 'iOS', icon: Smartphone },
      { label: 'Android', count: metrics.android, key: 'Android', icon: Smartphone },
      { label: 'Inactive (>30d)', count: metrics.inactive, key: 'Inactive', icon: CalendarX },
  ]

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
      {/* Charts */}
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

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ExpandableStatCard
            title="Total Devices"
            value={metrics.total}
            subValue="Managed"
            icon={Laptop}
          />
          <ExpandableStatCard
            title="Compliant"
            value={metrics.compliant}
            subValue={`${metrics.nonCompliant} Noncompliant`}
            intent="success"
            icon={CheckCircle}
          />
          <ExpandableStatCard
            title="Pending"
            value={metrics.pending}
            subValue="In Grace Period"
            intent={metrics.pending > 0 ? 'warning' : 'neutral'}
            icon={Clock}
          />
          <ExpandableStatCard
            title="Inactive Devices"
            value={metrics.inactive}
            subValue="> 30 Days"
            intent={metrics.inactive > 0 ? 'warning' : 'success'}
            icon={CalendarX}
          >
              <div className="text-xs text-gray-500">
                  Devices that haven't synced in over 30 days. Consider cleaning them up.
              </div>
          </ExpandableStatCard>
      </div>

      {/* Filter Buttons & Table */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
            <button
                key={f.label}
                onClick={() => setFilter(filter === f.key ? null : f.key)}
                className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors whitespace-nowrap ${
                filter === f.key
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
                <f.icon size={16} />
                {f.label}
                <span className="bg-gray-100 px-1.5 py-0.5 rounded-full text-xs text-gray-600 ml-1">
                {f.count}
                </span>
            </button>
            ))}
        </div>

        <DataTable 
            title={filter ? `Devices: ${filters.find(f => f.key === filter)?.label}` : 'All Devices'}
            columns={columns} 
            data={filteredDevices} 
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
    </div>
  )
}