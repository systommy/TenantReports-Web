import type { ProcessedReport } from '../../processing/types';
import DefenderIncidents from './DefenderIncidents';
import DefenderSummary from './DefenderSummary';
import PrivilegedAccess from './PrivilegedAccess';
import DataTable from '../tables/DataTable';
import StatusPill from '../common/StatusPill';
import { formatDate } from '../../utils/format';

export default function SecurityOpsTab({ data }: { data: ProcessedReport }) {
  return (
    <div className="space-y-8">
      {/* Privileged Access (Moved from Identity) */}
      {data.privileged && (
      <div id="privileged-access" className="space-y-4">
         <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Privileged Access</h3>
         <PrivilegedAccess data={data.privileged} />
      </div>
      )}

      {/* Defender Incidents - Top Priority */}
      {data.defenderIncidents && (
      <DefenderIncidents data={data.defenderIncidents} />
      )}

      {data.defender && (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Microsoft Defender</h3>
        <DefenderSummary data={data.defender} />
      </div>
      )}

      {/* PIM Activations (From Identity) */}
      {data.privileged && data.privileged.activations.length > 0 && (
        <div id="pim-activations" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">PIM Activations</h3>
          <DataTable 
            columns={[
              { accessorKey: 'timestamp', header: 'Timestamp', cell: ({ getValue }) => formatDate(getValue() as string) },
              { accessorKey: 'activity', header: 'Activity' },
              { accessorKey: 'initiated_by', header: 'Initiated By' },
              { accessorKey: 'target_role', header: 'Target Role' },
              { 
                accessorKey: 'result', 
                header: 'Result',
                cell: ({ getValue }) => {
                    const v = (getValue() as string)?.toLowerCase();
                    const intent = v === 'success' ? 'success' : 'danger';
                    return <StatusPill label={String(getValue() ?? '')} intent={intent} />;
                }
              },
            ]} 
            data={data.privileged.activations} 
            pageSize={10} 
          />
        </div>
      )}
    </div>
  );
}
