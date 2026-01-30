import type { ColumnDef } from '@tanstack/react-table'
import DataTable from '../tables/DataTable'
import StatusPill from '../common/StatusPill'
import { AlertTriangle, ShieldAlert, Shield, Info } from 'lucide-react'
import type { ServicePrincipals as ServicePrincipalsData, ServicePrincipalApp } from '../../processing/types'

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

export default function ServicePrincipals({ data }: { data: ServicePrincipalsData }) {
  if (!data.all_apps.length) return null

  const columns: ColumnDef<ServicePrincipalApp, unknown>[] = [
    { accessorKey: 'name', header: 'Application Name' },
    {
      accessorKey: 'risk_level', header: 'Risk Level',
      cell: ({ getValue }) => {
        const v = (getValue() as string)?.toLowerCase();
        const intent = v === 'high' ? 'danger' : v === 'medium' ? 'warning' : 'info';
        return <StatusPill label={String(getValue() ?? '')} intent={intent} />;
      },
    },
    { accessorKey: 'consent_type', header: 'Consent Type' },
    { accessorKey: 'principal', header: 'Principal' },
    {
      id: 'permission_count', header: 'Permission Count',
      accessorFn: (row) => row.permissions.length,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Critical" value={data.summary.critical} colorClass="text-rose-600" bgClass="bg-rose-50" icon={ShieldAlert} />
        <MetricCard title="High" value={data.summary.high} colorClass="text-amber-600" bgClass="bg-amber-50" icon={AlertTriangle} />
        <MetricCard title="Medium" value={data.summary.medium} colorClass="text-yellow-600" bgClass="bg-yellow-50" icon={Shield} />
        <MetricCard title="Low" value={data.summary.low} colorClass="text-blue-600" bgClass="bg-blue-50" icon={Info} />
      </div>
      <DataTable 
        title="Application Permissions"
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
                     <div>
                        <span className="text-xs text-gray-500 uppercase block mb-1">Risk:</span> 
                        <StatusPill label={p.risk_level ?? ''} intent={p.risk_level === 'High' ? 'danger' : 'neutral'} />
                     </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No specific permissions listed.</p>
            )}
          </div>
        )}
      />
    </div>
  )
}
