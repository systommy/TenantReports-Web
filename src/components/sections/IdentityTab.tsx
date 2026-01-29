import { Shield, Users, Smartphone, Key } from 'lucide-react';
import type { ProcessedReport } from '../../processing/types';
import ExpandableStatCard from '../common/ExpandableStatCard';
import UserMetrics from './UserMetrics';
import PrivilegedAccess from './PrivilegedAccess';
import RiskyUsers from './RiskyUsers';
import { pct } from '../../utils/format';
import BarChart from '../charts/BarChart';

export default function IdentityTab({ data }: { data: ProcessedReport }) {
  // MFA Methods Chart Data
  const mfaMethods = Object.entries(data.mfa.methods)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ label: k, value: v }));

  return (
    <div className="space-y-8">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
          title="Global Admins"
          value={data.users.admin}
          subValue={pct(data.users.admin / data.users.total)}
          intent="warning"
          icon={Shield}
        >
            <div className="text-xs text-gray-500">
                Admins should be minimized. Review Privileged Access section.
            </div>
        </ExpandableStatCard>

        <ExpandableStatCard
          title="MFA Registration"
          value={pct(data.mfa.adoption_rate)}
          subValue={`${data.mfa.mfa_registered} Users`}
          intent={data.mfa.adoption_rate > 0.9 ? 'success' : 'danger'}
          icon={Smartphone}
        >
             <div className="space-y-2">
                 <div className="text-xs font-bold text-gray-900">Methods Used</div>
                 <div className="h-20">
                    <BarChart 
                        labels={mfaMethods.map(m => m.label)} 
                        datasets={[{ label: 'Users', values: mfaMethods.map(m => m.value) }]}
                        title=""
                        horizontal
                    />
                 </div>
             </div>
        </ExpandableStatCard>

        <ExpandableStatCard
          title="Legacy Auth"
          value="Check" 
          subValue="Logs"
          intent="neutral"
          icon={Key}
        >
            <div className="text-xs text-gray-500">
                Check sign-in logs for 'Legacy Authentication' clients.
            </div>
        </ExpandableStatCard>
      </div>

      {/* Main Content Areas */}
      
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">User Directory</h3>
        <UserMetrics data={data.users} details={data.userDetails} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
         <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Privileged Access</h3>
            <PrivilegedAccess data={data.privileged} />
         </div>

         <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Risk Detection</h3>
            <RiskyUsers data={data.riskyUsers} />
         </div>
      </div>
    </div>
  );
}
