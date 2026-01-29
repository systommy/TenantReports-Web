import type { ProcessedReport } from '../../processing/types';
import ComplianceOverview from './ComplianceOverview';
import AppleMdm from './AppleMdm';

export default function ComplianceTab({ data }: { data: ProcessedReport }) {
  return (
    <div className="space-y-8">
      <ComplianceOverview data={data.compliance} devices={data.deviceDetails} />
      <AppleMdm data={data.appleMdm} />
    </div>
  );
}
