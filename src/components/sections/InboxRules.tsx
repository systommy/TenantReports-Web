import type { ColumnDef } from '@tanstack/react-table'
import DataTable from '../tables/DataTable'
import StatusPill from '../common/StatusPill'
import type { InboxForwardingRules, InboxForwardingRule } from '../../processing/types'

export default function InboxRules({ data }: { data: InboxForwardingRules }) {
  const columns: ColumnDef<InboxForwardingRule, unknown>[] = [
    { accessorKey: 'mailbox_display', header: 'Mailbox' },
    { accessorKey: 'mailbox_upn', header: 'UPN' },
    { accessorKey: 'rule_name', header: 'Rule Name' },
    { 
        accessorKey: 'rule_enabled', 
        header: 'Status',
        cell: ({ getValue }) => <StatusPill label={getValue() ? 'Enabled' : 'Disabled'} intent={getValue() ? 'success' : 'neutral'} />
    },
    { accessorKey: 'forward_target', header: 'Target' },
    { 
        accessorKey: 'target_domain', 
        header: 'Target Domain',
        cell: ({ getValue }) => <span className="font-mono text-xs">{getValue() as string}</span>
    },
  ]

  const externalForwards = data.summary.enabled_external_forwards;

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
               <div className="text-xs text-gray-500 font-medium uppercase mb-1">Total Checked</div>
               <div className="text-2xl font-bold text-gray-900">{data.summary.total_mailboxes_checked}</div>
           </div>
           <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
               <div className="text-xs text-gray-500 font-medium uppercase mb-1">External Forwards Found</div>
               <div className={`text-2xl font-bold ${data.summary.external_forwards_found > 0 ? 'text-amber-600' : 'text-gray-900'}`}>{data.summary.external_forwards_found}</div>
           </div>
           <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
               <div className="text-xs text-gray-500 font-medium uppercase mb-1">Enabled External Forwards</div>
               <div className={`text-2xl font-bold ${externalForwards > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{externalForwards}</div>
           </div>
       </div>

       {data.summary.external_domains && data.summary.external_domains.length > 0 && (
           <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
               <span className="font-bold">External Domains Detected:</span> {data.summary.external_domains.join(', ')}
           </div>
       )}

       <DataTable 
          title="Inbox Forwarding Rules" 
          columns={columns} 
          data={data.rules} 
       />
    </div>
  )
}
