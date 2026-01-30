import { 
  Shield, 
  Smartphone, 
  Users,
  Monitor,
  Building,
  Hash,
  Calendar,
  Globe
} from 'lucide-react';
import type { ProcessedReport } from '../../processing/types';
import ExpandableStatCard from '../common/ExpandableStatCard';
import SecurityScores from './SecurityScores';
import Misconfigurations from './Misconfigurations';
import MfaCoverage from './MfaCoverage';
import { pct } from '../../utils/format';

interface OverviewTabProps {
  data: ProcessedReport;
}

export default function OverviewTab({ data }: OverviewTabProps) {
  // --- Data Preparation ---
  const scoreTrend = data.security.trend_percentage_change;
  const scoreHistoryLabels = data.security.history.map(h => h.date);
  const scoreHistoryValues = data.security.history.map(h => h.score ?? 0);
  
  const mfaAtRisk = data.mfa.total_users - data.mfa.mfa_registered;
  
  return (
    <div className="space-y-8">
      {/* Tenant Information */}
      <div id="tenant-info" className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Tenant Information</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Building size={20} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Tenant Name</p>
                <p className="text-sm font-bold text-gray-900 break-all">{data.tenant.organization_name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Hash size={20} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Tenant ID</p>
                <p className="text-xs font-mono font-bold text-gray-900 break-all">{data.tenant.tenant_id}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Created Date</p>
                <p className="text-sm font-bold text-gray-900">{data.tenant.created_date}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Globe size={20} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Primary Domain</p>
                <p className="text-sm font-bold text-gray-900">{data.tenant.primary_domain}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div id="executive-summary" className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Executive Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ExpandableStatCard 
            title="Secure Score" 
            value={`${data.security.score_percentage ? data.security.score_percentage.toFixed(1) : 0}%`} 
            subValue={scoreTrend ? `${scoreTrend > 0 ? '+' : ''}${scoreTrend.toFixed(1)}%` : undefined} 
            intent={data.security.trend_direction === 'increase' ? 'success' : 'neutral'}
            trendLabel={`Target: ${data.security.max_score} pts`}
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
            title="Total Users" 
            value={data.users.total}
            subValue={`${data.users.enabled} Active`}
            icon={Users}
          >
             <div className="space-y-1 text-xs">
               <div className="flex justify-between"><span>Licensed</span> <strong>{data.users.licensed}</strong></div>
               <div className="flex justify-between"><span>Guests</span> <strong>{data.users.guest}</strong></div>
             </div>
          </ExpandableStatCard>

          <ExpandableStatCard 
            title="Total Devices" 
            value={data.tenant.total_devices} 
            subValue="Managed" 
            icon={Monitor}
          >
             <div className="text-xs text-gray-500">
               Total devices registered in Entra ID / Intune.
             </div>
          </ExpandableStatCard>
        </div>
      </div>

      <div id="misconfigurations" className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Common Misconfigurations</h3>
        <Misconfigurations data={data.configuration} />
      </div>

      <SecurityScores 
        data={data.security} 
        historyLabels={scoreHistoryLabels}
        historyValues={scoreHistoryValues}
      />

      <div id="mfa-coverage" className="pt-8 border-t border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">MFA & Identity Security</h3>
        <MfaCoverage data={data.mfa} />
      </div>
    </div>
  );
}
