import type { ProcessedReport } from '../../processing/types';
import LicenseOverview from './LicenseOverview';

export default function LicensingTab({ data }: { data: ProcessedReport }) {
  return (
    <div className="space-y-8">
      {data.licenses && (
      <div id="license-overview" className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">License Overview</h3>
        <LicenseOverview data={data.licenses} />
      </div>
      )}
    </div>
  );
}
