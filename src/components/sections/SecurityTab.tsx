import type { ProcessedReport } from '../../processing/types';
import SentinelIncidents from './SentinelIncidents';
import DefenderSummary from './DefenderSummary';

export default function SecurityTab({ data }: { data: ProcessedReport }) {
  return (
    <div className="space-y-8">
      {/* Sentinel Incidents - Top Priority */}
      <SentinelIncidents data={data.sentinel} />

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Microsoft Defender</h3>
        <DefenderSummary data={data.defender} />
      </div>
    </div>
  );
}
