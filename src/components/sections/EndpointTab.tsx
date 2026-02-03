import type { ProcessedReport } from '../../processing/types';
import ComplianceOverview from './ComplianceOverview';
import AppleMdm from './AppleMdm';
import { Info } from 'lucide-react';

function EmptyState({ message }: { message: string }) {
    return (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-6 flex items-center gap-3 text-gray-500">
            <Info size={20} />
            <span className="text-sm font-medium">{message}</span>
        </div>
    )
}

export default function EndpointTab({ data }: { data: ProcessedReport }) {
  return (
    <div className="space-y-8">
      {data.compliance && (
      <div id="intune-device-compliance">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Intune Device Compliance</h3>
        <ComplianceOverview data={data.compliance} devices={data.deviceDetails ?? []} />
      </div>
      )}
      
      {data.appleMdm && (
      <div id="apple-mdm-certificates">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Apple MDM Certificates</h3>
        {data.appleMdm.certificates.length > 0 ? (
          <AppleMdm data={data.appleMdm} />
        ) : (
          <EmptyState message="No Apple MDM certificate data available." />
        )}
      </div>
      )}
    </div>
  );
}
