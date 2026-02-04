import type { ColumnDef } from '@tanstack/react-table'
import DataTable from '../tables/DataTable'
import StatusPill from '../common/StatusPill'
import { AlertTriangle, ShieldAlert, Shield, Info } from 'lucide-react'
import type { ServicePrincipals as ServicePrincipalsData, ServicePrincipalApp } from '../../processing/types'
import ExpiringCredentials from './ExpiringCredentials'
import { useState } from 'react'

function MetricCard({ 
    title, 
    value, 
    colorClass, 
    bgClass, 
    icon: Icon,
    onClick,
    isSelected
}: { 
    title: string; 
    value: number | string; 
    colorClass: string; 
    bgClass: string; 
    icon: any;
    onClick: () => void;
    isSelected: boolean;
}) {
    return (
        <div 
            onClick={onClick}
            className={`bg-white rounded-xl border p-4 shadow-sm flex items-start justify-between group cursor-pointer transition-all duration-200 ${
                isSelected 
                    ? 'ring-2 ring-indigo-500 border-indigo-500 shadow-md' 
                    : 'border-gray-200 hover:border-indigo-200 hover:shadow-md'
            }`}
        >
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
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');

  if (!data.all_apps.length) return null

  const handleFilter = (type: 'all' | 'critical' | 'high' | 'medium' | 'low') => {
      setFilter(prev => prev === type ? 'all' : type);
  };

  const filteredApps = data.all_apps.filter(app => {
      if (filter === 'all') return true;
      return (app.risk_level || '').toLowerCase() === filter;
  });

  const columns: ColumnDef<ServicePrincipalApp, unknown>[] = [
    { accessorKey: 'name', header: 'Application Name' },
    {
      accessorKey: 'risk_level', header: 'Risk Level',
      cell: ({ getValue }) => {
        const v = (getValue() as string)?.toLowerCase();
        const intent = (v === 'high' || v === 'critical') ? 'danger' : v === 'medium' ? 'warning' : v === 'low' ? 'info' : 'neutral';
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
      {data.expiring_credentials.length > 0 && (
          <ExpiringCredentials credentials={data.expiring_credentials} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
            title="Critical" 
            value={data.summary.critical} 
            colorClass="text-rose-600" 
            bgClass="bg-rose-50" 
            icon={ShieldAlert} 
            onClick={() => handleFilter('critical')}
            isSelected={filter === 'critical'}
        />
        <MetricCard 
            title="High" 
            value={data.summary.high} 
            colorClass="text-amber-600" 
            bgClass="bg-amber-50" 
            icon={AlertTriangle} 
            onClick={() => handleFilter('high')}
            isSelected={filter === 'high'}
        />
        <MetricCard 
            title="Medium" 
            value={data.summary.medium} 
            colorClass="text-yellow-600" 
            bgClass="bg-yellow-50" 
            icon={Shield} 
            onClick={() => handleFilter('medium')}
            isSelected={filter === 'medium'}
        />
        <MetricCard 
            title="Low" 
            value={data.summary.low} 
            colorClass="text-blue-600" 
            bgClass="bg-blue-50" 
            icon={Info} 
            onClick={() => handleFilter('low')}
            isSelected={filter === 'low'}
        />
      </div>
      <DataTable 
        title={`Application Permissions ${filter !== 'all' ? `(${filter})` : ''}`}
        columns={columns} 
        data={filteredApps} 
        renderSubComponent={({ row }) => (
          <div className="pl-4 pr-2 py-2">
            <h4 className="font-semibold text-xs uppercase text-gray-500 mb-2 tracking-wider">Assigned Permissions</h4>
            {row.permissions && row.permissions.length > 0 ? (
              <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Permission</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Resource</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Principal</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {row.permissions.map((p, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                         <td className="px-4 py-2 text-sm font-medium text-gray-900">{p.permission}</td>
                         <td className="px-4 py-2 text-sm text-gray-500">{p.resource}</td>
                         <td className="px-4 py-2 text-sm text-gray-500">{p.principal}</td>
                         <td className="px-4 py-2 text-sm text-gray-500">{p.consent_type}</td>
                         <td className="px-4 py-2 text-sm">
                            <StatusPill 
                                label={p.risk_level || 'None'} 
                                intent={(() => {
                                    const r = (p.risk_level || '').toLowerCase();
                                    return (r === 'high' || r === 'critical') ? 'danger' : r === 'medium' ? 'warning' : r === 'low' ? 'info' : 'neutral';
                                })()} 
                            />
                         </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
