import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import Section from '../Section'
import Badge from '../Badge'
import DataTable from '../tables/DataTable'
import DoughnutChart from '../charts/DoughnutChart'
import { statusStyle } from '../../utils/badges'
import { formatDate } from '../../utils/format'
import type { ComplianceOverview as ComplianceOverviewData } from '../../processing/types'

const columns: ColumnDef<Record<string, unknown>, unknown>[] = [
  { accessorKey: 'DeviceName', header: 'DeviceName' },
  { accessorKey: 'OperatingSystem', header: 'OperatingSystem' },
  {
    accessorKey: 'ComplianceState', header: 'ComplianceState',
    cell: ({ getValue }) => {
      const v = getValue() as string
      return <Badge label={v ?? ''} style={statusStyle(v)} />
    },
  },
  { accessorKey: 'OwnerType', header: 'OwnerType' },
  {
    accessorKey: 'LastSyncDateTime', header: 'LastSyncDateTime',
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

  if (isEmpty) return null

  return (
    <Section title="Compliance Overview" id="compliance-overview">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DoughnutChart labels={Object.keys(compliance)} values={Object.values(compliance)} title="Compliance Status" />
        <DoughnutChart labels={Object.keys(os)} values={Object.values(os)} title="OS Distribution" />
        <DoughnutChart labels={Object.keys(ownership)} values={Object.values(ownership)} title="Ownership" />
      </div>
      <DataTable 
        columns={columns} 
        data={devices} 
        renderSubComponent={({ row }) => (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {Object.entries(row).map(([k, v]) => (
              <div key={k} className="flex flex-col">
                <span className="font-semibold text-gray-500 text-xs uppercase">{k}</span>
                <span className="break-all">{String(v ?? '-')}</span>
              </div>
            ))}
          </div>
        )}
      />
    </Section>
  )
}
