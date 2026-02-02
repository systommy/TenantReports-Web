import { Shield, Users, Smartphone, UserMinus } from 'lucide-react';
import type { ProcessedReport } from '../../processing/types';
import ExpandableStatCard from '../common/ExpandableStatCard';
import UserMetrics from './UserMetrics';
import PrivilegedAccess from './PrivilegedAccess';
import RiskyUsers from './RiskyUsers';
import ServicePrincipals from './ServicePrincipals';
import MailboxPermissions from './MailboxPermissions';
import CalendarPermissions from './CalendarPermissions';
import DataTable from '../tables/DataTable';
import StatusPill from '../common/StatusPill';
import { pct, formatDate } from '../../utils/format';
import BarChart from '../charts/BarChart';

export default function IdentityTab({ data }: { data: ProcessedReport }) {
  // MFA Methods Chart Data
  const mfaMethods = Object.entries(data.mfa.methods)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ label: k, value: v }));

  return (
    <div className="space-y-8">
      {/* Main Content Areas */}
      
      <div id="user-directory" className="space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">User Directory</h3>
        
        {/* Top Metrics moved here */}
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

        <UserMetrics data={data.users} details={data.userDetails} />
      </div>

      <div id="privileged-access" className="space-y-4">
         <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Privileged Access</h3>
         <PrivilegedAccess data={data.privileged} />
      </div>

      {data.privileged.activations.length > 0 && (
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

      <div id="risky-users" className="space-y-4">
         <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Risky Users</h3>
         <RiskyUsers data={data.riskyUsers} />
      </div>

      <div id="service-principals" className="space-y-4">
         <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Service Principals & App Registrations</h3>
         <ServicePrincipals data={data.servicePrincipals} appCredentials={data.appCredentials} />
      </div>

      <div id="mailbox-permissions" className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Mailbox Permissions</h3>
        <MailboxPermissions data={data.mailbox} />
      </div>

      <div id="calendar-permissions" className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Calendar Permissions</h3>
        <CalendarPermissions data={data.calendar} />
      </div>
    </div>
  );
}
