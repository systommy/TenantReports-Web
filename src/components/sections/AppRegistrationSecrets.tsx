import type { ColumnDef } from '@tanstack/react-table'
import DataTable from '../tables/DataTable'
import StatusPill from '../common/StatusPill'
import ExpandableStatCard from '../common/ExpandableStatCard'
import { formatDate } from '../../utils/format'
import type { AppRegistrationData, AppRegistrationCredential } from '../../processing/types'
import { Key, ShieldAlert, ShieldCheck, Timer } from 'lucide-react'
import { useState } from 'react'

const columns: ColumnDef<AppRegistrationCredential, unknown>[] = [
  { accessorKey: 'AppDisplayName', header: 'Application' },
  { accessorKey: 'CredentialType', header: 'Type' },
  {
    accessorKey: 'EndDate', header: 'Expires',
    cell: ({ getValue }) => formatDate(getValue() as string),
  },
  {
    accessorKey: 'DaysRemaining', header: 'Days Left',
    cell: ({ getValue }) => {
        const val = getValue() as number;
        const intent = val < 0 ? 'danger' : val < 30 ? 'warning' : 'success';
        return <StatusPill label={String(Math.floor(val))} intent={intent} />;
    },
  },
  {
    accessorKey: 'Status', header: 'Status',
    cell: ({ getValue }) => {
        const v = (getValue() as string)?.toLowerCase();
        const intent = v === 'expired' ? 'danger' : v === 'expiring' ? 'warning' : 'success';
        return <StatusPill label={String(getValue() ?? '')} intent={intent} />;
    },
  },
]

export default function AppRegistrationSecrets({ data }: { data: AppRegistrationData }) {
  const [filter, setFilter] = useState<'all' | 'expiring' | 'expired' | 'valid'>('all');

  if (!data || !data.summary) return null

  const { summary, credentials } = data

  const handleFilter = (type: 'all' | 'expiring' | 'expired' | 'valid') => {
      setFilter(prev => prev === type ? 'all' : type);
  };

  const filteredData = credentials.filter(c => {
      if (filter === 'all') return true;
      if (filter === 'expired') return c.DaysRemaining < 0 || c.Status.toLowerCase() === 'expired';
      if (filter === 'expiring') return c.DaysRemaining >= 0 && c.DaysRemaining < 30; // Assuming 30 is the threshold
      if (filter === 'valid') return c.DaysRemaining >= 30 && c.Status.toLowerCase() !== 'expired';
      return true;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ExpandableStatCard
            title="Total Credentials"
            value={summary.TotalCredentials}
            icon={Key}
            intent="neutral"
            onClick={() => handleFilter('all')}
            isSelected={filter === 'all'}
        />
        <ExpandableStatCard
            title="Expiring Soon"
            value={summary.ExpiringSoonCount}
            icon={Timer}
            intent={summary.ExpiringSoonCount > 0 ? 'warning' : 'success'}
            subValue={summary.DaysUntilExpiryThreshold + ' days'}
            onClick={() => handleFilter('expiring')}
            isSelected={filter === 'expiring'}
        />
        <ExpandableStatCard
            title="Expired"
            value={summary.ExpiredCount}
            icon={ShieldAlert}
            intent={summary.ExpiredCount > 0 ? 'danger' : 'success'}
            onClick={() => handleFilter('expired')}
            isSelected={filter === 'expired'}
        />
        <ExpandableStatCard
            title="Valid"
            value={summary.ValidCount}
            icon={ShieldCheck}
            intent="success"
            onClick={() => handleFilter('valid')}
            isSelected={filter === 'valid'}
        />
      </div>

      <DataTable 
          title={`App Registration Credentials ${filter !== 'all' ? `(${filter})` : ''}`}
          columns={columns} 
          data={filteredData} 
          pageSize={10}
      />
    </div>
  )
}
