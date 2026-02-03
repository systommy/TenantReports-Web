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
