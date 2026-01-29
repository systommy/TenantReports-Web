import { 
  Shield, 
  AlertTriangle, 
  Smartphone, 
  CheckCircle, 
  Activity,
  ArrowRight
} from 'lucide-react';
import type { ProcessedReport } from '../../processing/types';
import ExpandableStatCard from '../common/ExpandableStatCard';
import StatusPill from '../common/StatusPill';
import LineChart from '../charts/LineChart';
import SecurityScores from './SecurityScores';
import { pct } from '../../utils/format';

interface OverviewTabProps {
  data: ProcessedReport;
}

export default function OverviewTab({ data }: OverviewTabProps) {
  // --- Data Preparation ---
  const scoreTrend = data.security.trend_percentage_change;
  const scoreHistoryLabels = data.security.history.map(h => h.date);
  const scoreHistoryValues = data.security.history.map(h => h.score ?? 0);
  
  const activeIncidents = data.sentinel.incidents.filter(i => i.status !== 'Closed');
  const highSeverityIncidents = activeIncidents.filter(i => i.severity === 'High');
  
  const mfaAtRisk = data.mfa.total_users - data.mfa.mfa_registered;
  
  const nonCompliantDevices = (data.compliance.intune.nonCompliant as number) || 0;
  
  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ExpandableStatCard 
          title="Secure Score" 
          value={`${data.security.current_score || 0}%`} 
          subValue={scoreTrend ? `${scoreTrend > 0 ? '+' : ''}${scoreTrend.toFixed(1)}%` : undefined} 
          intent={data.security.trend_direction === 'increase' ? 'success' : 'neutral'}
          trendLabel={`Target: ${data.security.max_score}%`}
          icon={Shield}
        >
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Identity</span>
              <span className="font-bold">{data.security.control_scores.find(c => c.category === 'Identity')?.score || '-'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Devices</span>
              <span className="font-bold">{data.security.control_scores.find(c => c.category === 'Device')?.score || '-'}</span>
            </div>
             <div className="flex justify-between text-xs">
              <span>Apps</span>
              <span className="font-bold">{data.security.control_scores.find(c => c.category === 'Apps')?.score || '-'}</span>
            </div>
          </div>
        </ExpandableStatCard>

        <ExpandableStatCard 
          title="Active Incidents" 
          value={activeIncidents.length} 
          subValue="Action Required" 
          intent={activeIncidents.length > 0 ? 'danger' : 'success'}
          trendLabel={`${highSeverityIncidents.length} High Severity`}
          icon={AlertTriangle}
        >
           <div className="text-xs space-y-2">
             {highSeverityIncidents.slice(0, 3).map((inc, i) => (
               <div key={i} className="p-2 bg-rose-50 rounded border border-rose-100 text-rose-800 font-medium truncate">
                 {inc.title}
               </div>
             ))}
             {highSeverityIncidents.length === 0 && (
               <div className="text-gray-500 italic">No high severity incidents.</div>
             )}
           </div>
        </ExpandableStatCard>

        <ExpandableStatCard 
          title="MFA Coverage" 
          value={pct(data.mfa.adoption_rate)} 
          subValue={`${mfaAtRisk} At Risk`} 
          intent={data.mfa.adoption_rate > 0.9 ? 'success' : 'warning'}
          trendLabel="Target: 100%"
          icon={Smartphone}
        >
           <div className="space-y-2 text-xs">
             <div className="flex justify-between">
               <span>Registered</span>
               <span className="font-bold">{data.mfa.mfa_registered} / {data.mfa.total_users}</span>
             </div>
             <div className="flex justify-between">
               <span>SSPR Enabled</span>
               <span className="font-bold">{pct(data.mfa.sspr_adoption_rate)}</span>
             </div>
           </div>
        </ExpandableStatCard>

        <ExpandableStatCard 
          title="Compliance" 
          value={`${data.compliance.intune.compliantPercent || 0}%`} 
          subValue="Devices" 
          intent={(data.compliance.intune.compliantPercent as number) > 90 ? 'success' : 'warning'}
          trendLabel={`${nonCompliantDevices} Non-Compliant`}
          icon={CheckCircle}
        >
           <div className="space-y-1 text-xs text-gray-500">
             <div>Check device details for specifics on non-compliant policies.</div>
           </div>
        </ExpandableStatCard>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-900">Security Trends</h3>
              <p className="text-sm text-gray-500">Score performance over time</p>
            </div>
          </div>
          <div className="flex-1 min-h-[300px] w-full">
            {scoreHistoryLabels.length > 0 ? (
               <LineChart labels={scoreHistoryLabels} values={scoreHistoryValues} label="Secure Score" title="" />
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-400">
                <div className="text-center">
                  <Activity size={32} className="mx-auto mb-2 opacity-50" />
                  <span className="text-sm font-medium">No history data available</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions / List - High Density */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden h-full">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-bold text-gray-900 text-sm">Recent Alerts</h3>
            <button className="text-xs text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1">
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[400px]">
            {data.sentinel.incidents.slice(0, 10).map((inc, i) => (
              <div key={i} className="group p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors flex items-start gap-3 last:border-0 cursor-pointer">
                <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 shadow-sm ${
                  inc.severity === 'High' ? 'bg-rose-500 shadow-rose-200' : 
                  inc.severity === 'Medium' ? 'bg-amber-500 shadow-amber-200' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                    {inc.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 flex justify-between">
                    <StatusPill label={inc.status} size="xs" intent={
                      inc.status === 'New' ? 'danger' : inc.status === 'Active' ? 'warning' : 'neutral'
                    } />
                    <span className="font-mono">{new Date(inc.created).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
            {data.sentinel.incidents.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-sm">
                No active incidents found.
              </div>
            )}
          </div>
        </div>
      </div>

      <SecurityScores data={data.security} />
    </div>
  );
}
