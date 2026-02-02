import { useState, useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import DataTable from '../tables/DataTable';
import StatusPill from '../common/StatusPill';
import { Users, UserCheck, UserX, Shield, CreditCard, UserMinus } from 'lucide-react';

interface UserMetricsProps {
  data: any;
  details: any[];
}

const columns: ColumnDef<any, unknown>[] = [
  { accessorKey: 'DisplayName', header: 'Display Name' },
  { accessorKey: 'UserPrincipalName', header: 'UPN' },
  {
    accessorKey: 'AccountEnabled',
    header: 'Status',
    cell: ({ getValue }) => (
      <StatusPill 
        label={getValue() ? 'Enabled' : 'Disabled'} 
        intent={getValue() ? 'success' : 'neutral'} 
      />
    ),
  },
  { accessorKey: 'UserType', header: 'Type' },
  {
    accessorKey: 'IsLicensed',
    header: 'License',
    cell: ({ getValue }) => (
      <StatusPill 
        label={getValue() ? 'Licensed' : 'Unlicensed'} 
        intent={getValue() ? 'info' : 'warning'} 
      />
    ),
  },
  { accessorKey: 'City', header: 'City' },
];

export default function UserMetrics({ data, details }: UserMetricsProps) {
  const [filter, setFilter] = useState<string | null>(null);

  const filters = [
    { label: 'All Users', count: data.total, key: null, icon: Users },
    { label: 'Admins', count: data.admin, key: 'IsAdmin=true', icon: Shield },
    { label: 'Licensed Users', count: data.licensed, key: 'IsLicensed=true', icon: CreditCard },
    { label: 'Enabled', count: data.enabled, key: 'AccountEnabled=true', icon: UserCheck },
    { label: 'Disabled', count: data.disabled, key: 'AccountEnabled=false', icon: UserX },
    { label: 'Inactive', count: data.inactive, key: 'IsInactive=true', icon: UserMinus },
    { label: 'Guests', count: data.guest, key: 'UserType=Guest', icon: Users },
  ];

  const filteredDetails = useMemo(() => {
    if (!filter) return details;
    const [key, valStr] = filter.split('=');
    const val = valStr === 'true' ? true : valStr === 'false' ? false : valStr;
    return details.filter((u) => u[key] === val);
  }, [details, filter]);

  return (
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
        title={filter ? `Users: ${filters.find(f => f.key === filter)?.label}` : 'Full User Directory'}
        columns={columns}
        data={filteredDetails}
        pageSize={10}
        renderSubComponent={({ row }) => (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs text-gray-600">
            {Object.entries(row).map(([k, v]) => (
              <div key={k} className="flex flex-col">
                <span className="font-semibold text-gray-400 uppercase tracking-wider">{k}</span>
                <span className="break-all font-mono">{String(v ?? '-')}</span>
              </div>
            ))}
          </div>
        )}
      />
    </div>
  );
}
