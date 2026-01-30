import type { ProcessedReport } from '../../processing/types';
import ComplianceOverview from './ComplianceOverview';
import AppleMdm from './AppleMdm';
import SharedMailboxes from './SharedMailboxes';

export default function ComplianceTab({ data }: { data: ProcessedReport }) {
  return (
    <div className="space-y-8">
      <div id="intune-device-compliance">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Intune Device Compliance</h3>
        <ComplianceOverview data={data.compliance} devices={data.deviceDetails} />
      </div>
      
      <div id="apple-mdm-certificates">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Apple MDM Certificates</h3>
        <AppleMdm data={data.appleMdm} />
      </div>

      {data.sharedMailboxes.length > 0 && (
        <div id="shared-mailboxes">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Shared Mailbox Compliance</h3>
            <SharedMailboxes data={data.sharedMailboxes} />
        </div>
      )}
    </div>
  );
}
