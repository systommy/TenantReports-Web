import type { ColumnDef } from '@tanstack/react-table'
import DataTable from '../tables/DataTable'
import StatusPill from '../common/StatusPill'
import type { SharedMailbox } from '../../processing/types'
import ExpandableStatCard from '../common/ExpandableStatCard'
import { Mail, CheckCircle, AlertOctagon } from 'lucide-react'

const columns: ColumnDef<SharedMailbox, unknown>[] = [
  { accessorKey: 'display_name', header: 'Display Name' },
  { accessorKey: 'upn', header: 'UPN' },
  { 
    accessorKey: 'sign_in_enabled', header: 'Sign-in',
    cell: ({ getValue }) => {
        const val = getValue() as boolean;
        return <StatusPill label={val ? 'Enabled' : 'Disabled'} intent={val ? 'warning' : 'success'} />;
    }
  },
  { 
    accessorKey: 'has_license', header: 'Licensed',
    cell: ({ getValue }) => {
        const val = getValue() as boolean;
        return <StatusPill label={val ? 'Yes' : 'No'} intent={val ? 'success' : 'neutral'} />;
    }
  },
  { 
    accessorKey: 'is_compliant', header: 'Status',
    cell: ({ getValue }) => {
        const val = getValue() as boolean;
        return <StatusPill label={val ? 'Compliant' : 'Non-Compliant'} intent={val ? 'success' : 'danger'} />;
    }
  },
]

export default function SharedMailboxes({ data }: { data: SharedMailbox[] }) {
  if (!data || data.length === 0) return null

  const total = data.length
  const nonCompliant = data.filter(m => !m.is_compliant).length
  const compliant = total - nonCompliant

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ExpandableStatCard
            title="Total Shared Mailboxes"
            value={total}
            icon={Mail}
            intent="neutral"
        />
        <ExpandableStatCard
            title="Compliant"
            value={compliant}
            icon={CheckCircle}
            intent="success"
            subValue={total > 0 ? `${Math.round((compliant / total) * 100)}%` : '0%'}
        />
        <ExpandableStatCard
            title="Non-Compliant"
            value={nonCompliant}
            icon={AlertOctagon}
            intent={nonCompliant > 0 ? 'danger' : 'success'}
        />
      </div>

      {nonCompliant > 0 && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-lg text-sm">
            <strong>{nonCompliant} shared mailboxes</strong> have sign-in enabled but no license assigned. This is a security risk and may violate licensing terms.
        </div>
      )}
      <DataTable 
        title="Shared Mailbox Compliance"
        columns={columns} 
        data={data} 
        pageSize={10} 
      />
    </div>
  )
}
