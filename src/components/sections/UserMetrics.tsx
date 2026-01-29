import { useState, useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import Section from '../Section'
import MetricCard from '../MetricCard'
import Badge from '../Badge'
import DataTable from '../tables/DataTable'
import { boolStyle, boolLabel } from '../../utils/badges'
import type { UsersSummary } from '../../processing/types'

const columns: ColumnDef<Record<string, unknown>, unknown>[] = [
  { accessorKey: 'DisplayName', header: 'DisplayName' },
  { accessorKey: 'UserPrincipalName', header: 'UserPrincipalName' },
  {
    accessorKey: 'AccountEnabled', header: 'AccountEnabled',
    cell: ({ getValue }) => <Badge label={boolLabel(getValue())} style={boolStyle(getValue())} />,
  },
  { accessorKey: 'UserType', header: 'UserType' },
  {
    accessorKey: 'IsLicensed', header: 'IsLicensed',
    cell: ({ getValue }) => <Badge label={boolLabel(getValue())} style={boolStyle(getValue())} />,
  },
  { accessorKey: 'City', header: 'City' },
]

export default function UserMetrics({ data, details }: { data: UsersSummary; details: Record<string, unknown>[] }) {
  const [filter, setFilter] = useState<string | null>(null)

  const cards = [
    { label: 'Total', value: data.total, key: null },
    { label: 'Enabled', value: data.enabled, key: 'AccountEnabled=true' },
    { label: 'Disabled', value: data.disabled, key: 'AccountEnabled=false' },
    { label: 'Licensed', value: data.licensed, key: 'IsLicensed=true' },
    { label: 'Unlicensed', value: data.unlicensed, key: 'IsLicensed=false' },
    { label: 'Guest', value: data.guest, key: 'UserType=Guest' },
    { label: 'Admin', value: data.admin, key: 'IsAdmin=true' },
    { label: 'MFA Registered', value: data.mfa_registered, key: 'MfaRegistered=true' },
    { label: 'MFA Not Registered', value: data.mfa_not_registered, key: 'MfaRegistered=false' },
    { label: 'Inactive', value: data.inactive, key: 'IsInactive=true' },
  ]

  const filteredDetails = useMemo(() => {
    if (!filter) return details
    const [key, valStr] = filter.split('=')
    const val = valStr === 'true' ? true : valStr === 'false' ? false : valStr
    
    return details.filter(u => {
      // In a real scenario, we might need stricter type checking or property existence checks
      return u[key] === val
    })
  }, [details, filter])

  return (
    <Section title="User Metrics" id="user-metrics">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {cards.map(c => (
          <MetricCard 
            key={c.label}
            label={c.label} 
            value={c.value} 
            isActive={filter === c.key}
            onClick={() => setFilter(filter === c.key ? null : c.key)}
            className="cursor-pointer"
          />
        ))}
      </div>
      <DataTable 
        columns={columns} 
        data={filteredDetails} 
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