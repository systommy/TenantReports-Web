import type { ColumnDef } from '@tanstack/react-table'
import Section from '../Section'
import MetricCard from '../MetricCard'
import Badge from '../Badge'
import DataTable from '../tables/DataTable'
import { severityStyle } from '../../utils/badges'
import type { ServicePrincipals as ServicePrincipalsData, ServicePrincipalApp } from '../../processing/types'

export default function ServicePrincipals({ data }: { data: ServicePrincipalsData }) {
  if (!data.all_apps.length) return null

  const columns: ColumnDef<ServicePrincipalApp, unknown>[] = [
    { accessorKey: 'name', header: 'Application Name' },
    {
      accessorKey: 'risk_level', header: 'Risk Level',
      cell: ({ getValue }) => <Badge label={String(getValue() ?? '')} style={severityStyle(getValue() as string)} />,
    },
    { accessorKey: 'consent_type', header: 'Consent Type' },
    { accessorKey: 'principal', header: 'Principal' },
    {
      id: 'permission_count', header: 'Permission Count',
      accessorFn: (row) => row.permissions.length,
    },
  ]

  return (
    <Section title="Service Principals" id="service-principals">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Critical" value={data.summary.critical} className="text-red-600" />
        <MetricCard label="High" value={data.summary.high} />
        <MetricCard label="Medium" value={data.summary.medium} />
        <MetricCard label="Low" value={data.summary.low} />
      </div>
      <DataTable 
        columns={columns} 
        data={data.all_apps} 
        renderSubComponent={({ row }) => (
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase text-gray-500">Permissions</h4>
            {row.permissions && row.permissions.length > 0 ? (
              <div className="grid gap-2">
                {row.permissions.map((p, i) => (
                  <div key={i} className="bg-white border p-3 rounded text-sm grid grid-cols-2 gap-2">
                     <div><span className="text-xs text-gray-500 uppercase">Permission:</span> {p.permission}</div>
                     <div><span className="text-xs text-gray-500 uppercase">Resource:</span> {p.resource}</div>
                     <div><span className="text-xs text-gray-500 uppercase">Type:</span> {p.consent_type}</div>
                     <div><span className="text-xs text-gray-500 uppercase">Risk:</span> <Badge label={p.risk_level ?? ''} style={p.risk_level === 'High' ? 'danger' : 'neutral'} /></div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No specific permissions listed.</p>
            )}
          </div>
        )}
      />
    </Section>
  )
}