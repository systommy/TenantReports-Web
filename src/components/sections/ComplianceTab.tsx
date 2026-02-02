import type { ProcessedReport } from '../../processing/types';
import ComplianceOverview from './ComplianceOverview';
import AppleMdm from './AppleMdm';
import SharedMailboxes from './SharedMailboxes';
import { Info } from 'lucide-react';

function EmptyState({ message }: { message: string }) {
    return (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-6 flex items-center gap-3 text-gray-500">
            <Info size={20} />
            <span className="text-sm font-medium">{message}</span>
        </div>
    )
}

export default function ComplianceTab({ data }: { data: ProcessedReport }) {
  return (
    <div className="space-y-8">
      <div id="intune-device-compliance">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Intune Device Compliance</h3>
        <ComplianceOverview data={data.compliance} devices={data.deviceDetails} />
      </div>
      
      <div id="apple-mdm-certificates">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Apple MDM Certificates</h3>
        {data.appleMdm.certificates.length > 0 ? (
          <AppleMdm data={data.appleMdm} />
        ) : (
          <EmptyState message="No Apple MDM certificate data available." />
        )}
      </div>

      <div id="shared-mailboxes">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Shared Mailbox Compliance</h3>
          {data.sharedMailboxes.length > 0 ? (
            <SharedMailboxes data={data.sharedMailboxes} />
          ) : (
            <EmptyState message="No shared mailbox compliance data available." />
          )}
      </div>
    </div>
  );
}
