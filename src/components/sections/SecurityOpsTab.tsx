import type { ProcessedReport } from '../../processing/types';
import DefenderIncidents from './DefenderIncidents';
import DefenderSummary from './DefenderSummary';
import PrivilegedAccess from './PrivilegedAccess';
import DataTable from '../tables/DataTable';
import StatusPill from '../common/StatusPill';
import { formatDate } from '../../utils/format';
import BarChart from '../charts/BarChart';

export default function SecurityOpsTab({ data }: { data: ProcessedReport }) {
  return (
    <div className="space-y-8">
      {/* Defender Incidents - Top Priority */}
      {data.defenderIncidents && (
      <div id="defender-incidents" className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Defender - Incidents</h3>
        <DefenderIncidents data={data.defenderIncidents} />
      </div>
      )}

      {data.defender && (
      <div id="defender-email" className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Defender - Email Alerts</h3>
        <DefenderSummary data={data.defender} />
      </div>
      )}

      {/* Privileged Roles - Assignments */}
      {data.privileged && (
      <div id="privileged-access" className="space-y-4">
         <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Privileged Roles - Assignments</h3>
         <PrivilegedAccess data={data.privileged} />
      </div>
      )}

      {/* Privileged Roles - PIM */}
      {data.privileged && (
        <div id="pim-activations" className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Privileged Roles - PIM</h3>
          
          {data.privileged.pim_summary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 mb-1">Total PIM Assignments</div>
                  <div className="text-2xl font-bold text-gray-900">{data.privileged.pim_summary.total_assignments}</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm border-l-4 border-l-blue-500">
                  <div className="text-sm font-medium text-gray-500 mb-1">Eligible Roles</div>
                  <div className="text-2xl font-bold text-gray-900">{data.privileged.pim_summary.eligible_assignments}</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm border-l-4 border-l-green-500">
                  <div className="text-sm font-medium text-gray-500 mb-1">Active Roles</div>
                  <div className="text-2xl font-bold text-gray-900">{data.privileged.pim_summary.active_assignments}</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm border-l-4 border-l-red-500">
                  <div className="text-sm font-medium text-gray-500 mb-1">Global Admin (Eligible/Active)</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {data.privileged.pim_summary.eligible_global_admins} / {data.privileged.pim_summary.active_global_admins}
                  </div>
              </div>
            </div>
          )}

          {data.privileged.assignments_by_role.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 h-80">
              <BarChart 
                title="PIM Assignments by Role"
                labels={data.privileged.assignments_by_role.map(r => r.role)}
                datasets={[
                  { label: 'Eligible', values: data.privileged.assignments_by_role.map(r => r.eligible), backgroundColor: '#3b82f6' },
                  { label: 'Active', values: data.privileged.assignments_by_role.map(r => r.active), backgroundColor: '#10b981' }
                ]}
              />
            </div>
          )}

          {data.privileged.activations.length > 0 && (
            <DataTable 
              title="PIM Assignment Logs"
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
          )}
        </div>
      )}
    </div>
  );
}
