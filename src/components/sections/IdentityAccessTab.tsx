import { 
  Shield, 
  Users, 
  Smartphone, 
  UserMinus,
  Info
} from 'lucide-react';
import type { ProcessedReport } from '../../processing/types';
import ExpandableStatCard from '../common/ExpandableStatCard';
import UserMetrics from './UserMetrics';
import RiskyUsers from './RiskyUsers';
import ServicePrincipals from './ServicePrincipals';
import MfaCoverage from './MfaCoverage';
import ConditionalAccess from './ConditionalAccess';
import AppRegistrationSecrets from './AppRegistrationSecrets';
import BarChart from '../charts/BarChart';
import { pct } from '../../utils/format';

function EmptyState({ message }: { message: string }) {
    return (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-6 flex items-center gap-3 text-gray-500">
            <Info size={20} />
            <span className="text-sm font-medium">{message}</span>
        </div>
    )
}

export default function IdentityAccessTab({ data }: { data: ProcessedReport }) {
  // MFA Methods Chart Data (from IdentityTab)
  const mfaMethods = data.mfa ? Object.entries(data.mfa.methods)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ label: k, value: v })) : [];

  return (
    <div className="space-y-8">
      
      {/* MFA Coverage (Moved from Overview) */}
      {data.mfa && (
      <div id="mfa-coverage" className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">MFA & Identity Security</h3>
        <MfaCoverage data={data.mfa} />
      </div>
      )}

      {/* Conditional Access (Moved from Overview) */}
      {data.conditionalAccess && (
      <div id="conditional-access-overview" className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Conditional Access Policies</h3>
        <ConditionalAccess data={data.conditionalAccess} />
      </div>
      )}

      {/* User Directory (From Identity) */}
      {data.users && (
      <div id="user-directory" className="space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">User Directory</h3>
        
        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

          {data.mfa && (
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
          )}

          <ExpandableStatCard
            title="Inactive Users"
            value={data.users.inactive}
            subValue="No login > 30d"
            intent={data.users.inactive > 0 ? 'warning' : 'success'}
            icon={UserMinus}
          >
              <div className="text-xs text-gray-500">
                  Users who haven't signed in for more than 30 days. Review and disable if not needed.
              </div>
          </ExpandableStatCard>
        </div>

        <UserMetrics data={data.users} details={data.userDetails ?? []} />
      </div>
      )}

      {/* Risky Users (From Identity) */}
      {data.riskyUsers && (
      <div id="risky-users" className="space-y-4">
         <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Risky Users</h3>
         <RiskyUsers data={data.riskyUsers} />
      </div>
      )}

      {/* Service Principals (From Identity) */}
      {data.servicePrincipals && (
      <div id="service-principals" className="space-y-4">
         <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Service Principals & App Registrations</h3>
         <ServicePrincipals data={data.servicePrincipals} />
      </div>
      )}

      {/* App Registration Secrets (From Compliance) */}
      {data.appCredentials && (
      <div id="app-registration-secrets">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">App Registration Secrets</h3>
        {data.appCredentials?.summary ? (
            <AppRegistrationSecrets data={data.appCredentials} />
        ) : (
            <EmptyState message="No App Registration Secrets data available." />
        )}
      </div>
      )}
    </div>
  );
}
