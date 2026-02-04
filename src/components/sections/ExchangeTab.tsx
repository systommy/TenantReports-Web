import type { ProcessedReport } from '../../processing/types';
import MailboxPermissions from './MailboxPermissions';
import CalendarPermissions from './CalendarPermissions';
import SharedMailboxes from './SharedMailboxes';
import InboxRules from './InboxRules';
import { Info } from 'lucide-react';

function EmptyState({ message }: { message: string }) {
    return (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-6 flex items-center gap-3 text-gray-500">
            <Info size={20} />
            <span className="text-sm font-medium">{message}</span>
        </div>
    )
}

export default function ExchangeTab({ data }: { data: ProcessedReport }) {
  return (
    <div className="space-y-8">
      {data.mailbox && (
      <div id="mailbox-permissions" className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Mailbox Permissions</h3>
        <MailboxPermissions data={data.mailbox} />
      </div>
      )}

      {data.calendar && (
      <div id="calendar-permissions" className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Calendar Permissions</h3>
        <CalendarPermissions data={data.calendar} />
      </div>
      )}

      {data.sharedMailboxes && (
      <div id="shared-mailboxes">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Shared Mailbox Compliance</h3>
          {data.sharedMailboxes.length > 0 ? (
            <SharedMailboxes data={data.sharedMailboxes} />
          ) : (
            <EmptyState message="No shared mailbox compliance data available." />
          )}
      </div>
      )}

      {data.inboxRules && (
        <div id="inbox-rules">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Inbox Forwarding Rules</h3>
            <InboxRules data={data.inboxRules} />
        </div>
      )}
    </div>
  );
}
