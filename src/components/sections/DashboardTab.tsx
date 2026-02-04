import { useState } from 'react';
import { 
  Shield, 
  Smartphone, 
  Users,
  Monitor,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Globe,
  MapPin,
  Mail
} from 'lucide-react';
import type { ProcessedReport } from '../../processing/types';
import type { TabId } from '../layout/Sidebar';
import ExpandableStatCard from '../common/ExpandableStatCard';
import SecurityScores from './SecurityScores';
import Misconfigurations from './Misconfigurations';
import LicenseOverview from './LicenseOverview';
import { pct } from '../../utils/format';

interface DashboardTabProps {
  data: ProcessedReport;
  onTabChange: (tab: TabId) => void;
}

function AlertBanner({ 
    title, 
    message, 
    intent, 
    onClick 
}: { 
    title: string; 
    message: string; 
    intent: 'warning' | 'danger'; 
    onClick: () => void 
}) {
    const Icon = intent === 'danger' ? ShieldAlert : AlertTriangle;
    const style = intent === 'danger' 
        ? 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100' 
        : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100';

    return (
        <div 
            onClick={onClick}
            className={`${style} border p-4 rounded-lg text-sm flex items-start gap-3 cursor-pointer transition-colors group mt-4`}
        >
            <Icon className="mt-0.5 shrink-0" size={18} />
            <div className="flex-1">
                <div className="font-bold mb-0.5 flex items-center gap-2">
                    {title}
                    <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
                <div className="opacity-90">{message}</div>
            </div>
        </div>
    );
}

export default function DashboardTab({ data, onTabChange }: DashboardTabProps) {
  const [isTenantInfoExpanded, setIsTenantInfoExpanded] = useState(false);
  // --- Data Preparation ---
  const scoreTrend = data.security?.trend_percentage_change;
  const scoreHistoryLabels = data.security?.history.map(h => h.date.split(' ')[0]) ?? [];
  const scoreHistoryValues = data.security?.history.map(h => h.score ?? 0) ?? [];
  
  const mfaAtRisk = (data.mfa?.total_users ?? 0) - (data.mfa?.mfa_registered ?? 0);

  // --- Alert Logic ---
  const alerts: React.ReactNode[] = [];

  const navigateTo = (tab: TabId, sectionId: string) => {
      onTabChange(tab);
      setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
  };

  // 1. Shared Mailboxes
  if (data.sharedMailboxes) {
      const nonCompliant = data.sharedMailboxes.filter(m => !m.is_compliant).length;
      if (nonCompliant > 0) {
          alerts.push(
              <AlertBanner
                  key="shared-mailboxes"
                  title="Non-Compliant Shared Mailboxes"
                  message={`${nonCompliant} shared mailboxes have sign-in enabled but no license assigned. This is a security risk.`}
                  intent="danger"
                  onClick={() => navigateTo('exchange', 'shared-mailboxes')}
              />
          );
      }
  }

  // 1b. Inbox Forwarding Rules
  if (data.inboxRules && data.inboxRules.summary.enabled_external_forwards > 0) {
      alerts.push(
          <AlertBanner
              key="inbox-rules-external"
              title="External Forwarding Rules Detected"
              message={`${data.inboxRules.summary.enabled_external_forwards} active inbox rules are forwarding emails to external domains. Review immediately.`}
              intent="danger"
              onClick={() => navigateTo('exchange', 'inbox-rules')}
          />
      );
  }

  // 2. App Registration Secrets
  if (data.appCredentials?.summary) {
      const { ExpiredCount, ExpiringSoonCount } = data.appCredentials.summary;
      if (ExpiredCount > 0) {
          alerts.push(
              <AlertBanner
                  key="app-secrets-expired"
                  title="Expired App Registration Secrets"
                  message={`${ExpiredCount} application credentials have expired and may cause service outages.`}
                  intent="danger"
                  onClick={() => navigateTo('identity', 'app-registration-secrets')}
              />
          );
      }
      
      if (ExpiringSoonCount > 0) {
          alerts.push(
              <AlertBanner
                  key="app-secrets-expiring"
                  title="Expiring App Registration Secrets"
                  message={`${ExpiringSoonCount} application credentials will expire soon. Renew them to prevent outages.`}
                  intent="warning"
                  onClick={() => navigateTo('identity', 'app-registration-secrets')}
              />
          );
      }
  }

  // 3. Apple MDM
  if (data.appleMdm?.certificates) {
      const expired = data.appleMdm.certificates.filter(c => 
          (c.days_left !== null && c.days_left <= 0) || c.status?.toLowerCase().includes('expired')
      ).length;
      
      const expiring = data.appleMdm.certificates.filter(c => 
          (c.days_left !== null && c.days_left > 0 && c.days_left < 30) || c.status?.toLowerCase().includes('expiring')
      ).length;

      if (expired > 0) {
           alerts.push(
              <AlertBanner
                  key="apple-mdm-expired"
                  title="Expired Apple MDM Certificates"
                  message={`${expired} APNS certificates have expired. Apple device management may be failing.`}
                  intent="danger"
                  onClick={() => navigateTo('endpoints', 'apple-mdm-certificates')}
              />
          );
      }
      
      if (expiring > 0) {
           alerts.push(
              <AlertBanner
                  key="apple-mdm-expiring"
                  title="Expiring Apple MDM Certificates"
                  message={`${expiring} APNS certificates will expire soon. Renew immediately.`}
                  intent="warning"
                  onClick={() => navigateTo('endpoints', 'apple-mdm-certificates')}
              />
          );
      }
  }

  // 4. Risky Users
  if (data.riskyUsers && data.riskyUsers.length > 0) {
      alerts.push(
          <AlertBanner
              key="risky-users"
              title="Risky Users Detected"
              message={`${data.riskyUsers.length} users have been flagged with risk events. Investigate immediately.`}
              intent="danger"
              onClick={() => navigateTo('identity', 'risky-users')}
          />
      );
  }

  return (
    <div className="space-y-8">
      {/* Tenant Overview */}
      {data.tenant && (
      <div id="tenant-overview" className="space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Tenant Overview</h3>
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.security && (
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
          )}

          {data.mfa && (
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
          )}

          {data.users && (
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
          )}

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

        {/* Basic Info Card (Expandable) */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div 
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between"
            onClick={() => setIsTenantInfoExpanded(!isTenantInfoExpanded)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
              <div className="flex items-start gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Tenant Name</p>
                  <p className="text-sm font-bold text-gray-900 break-all">{data.tenant.organization_name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Tenant ID</p>
                  <p className="text-sm font-bold text-gray-900 break-all">{data.tenant.tenant_id}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Created Date</p>
                  <p className="text-sm font-bold text-gray-900 break-all">{data.tenant.created_date}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Primary Domain</p>
                  <p className="text-sm font-bold text-gray-900 break-all">{data.tenant.primary_domain}</p>
                </div>
              </div>
            </div>
             <div className="ml-4 text-gray-400">
                 {isTenantInfoExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
             </div>
          </div>
          
          {isTenantInfoExpanded && (
             <div className="border-t border-gray-200 p-6 bg-gray-50/50 space-y-6">
                   {/* Location Info */}
                   <div>
                      <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                        <MapPin size={16} className="text-indigo-600" /> Location Details
                      </h4>
                      <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                           <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-4 py-3 text-sm text-gray-500 bg-gray-50 font-medium w-1/4">Country</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{data.tenant.country_code || '-'}</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 text-sm text-gray-500 bg-gray-50 font-medium">State/Province</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{data.tenant.state || '-'}</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 text-sm text-gray-500 bg-gray-50 font-medium">City</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{data.tenant.city || '-'}</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 text-sm text-gray-500 bg-gray-50 font-medium">Postal Code</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{data.tenant.postal_code || '-'}</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 text-sm text-gray-500 bg-gray-50 font-medium">Language</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{data.tenant.preferred_language || '-'}</td>
                              </tr>
                           </tbody>
                        </table>
                      </div>
                   </div>

                   {/* Technical Contacts */}
                   <div>
                      <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                        <Mail size={16} className="text-indigo-600" /> Technical Notification Emails
                      </h4>
                      {data.tenant.technical_notification_mails && data.tenant.technical_notification_mails.length > 0 ? (
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <ul className="space-y-1">
                              {data.tenant.technical_notification_mails.map((email, idx) => (
                                 <li key={idx} className="text-sm text-gray-700 font-mono bg-gray-50 px-2 py-1 rounded inline-block mr-2 mb-1">
                                   {email}
                                 </li>
                              ))}
                            </ul>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No technical notification emails configured.</p>
                      )}
                   </div>

                {/* Domains List */}
                {data.domains && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                       <Globe size={16} className="text-indigo-600" /> Verified Domains ({data.domains.length})
                    </h4>
                    <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Domain</th>
                            <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                            <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Verified</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {data.domains.map((d, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-2 text-sm font-medium text-gray-900">{d.domain}</td>
                              <td className="px-4 py-2 text-sm">
                                 <div className="flex gap-2">
                                     {d.is_default && <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full font-medium border border-indigo-200">Default</span>}
                                     {d.is_initial && <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full border border-gray-200">Initial</span>}
                                 </div>
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                 {d.is_verified ? (
                                     <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs font-medium border border-emerald-200">
                                         Verified
                                     </span>
                                 ) : (
                                     <span className="text-gray-400 text-xs">Unverified</span>
                                 )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
             </div>
          )}
        </div>

        {/* Actionable Alerts */}
        {alerts.length > 0 && (
            <div className="space-y-3">
                {alerts}
            </div>
        )}
      </div>
      )}

      {data.configuration && (
      <div id="misconfigurations" className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Common Misconfigurations</h3>
        <Misconfigurations data={data.configuration} />
      </div>
      )}

      {data.security && (
      <SecurityScores 
        data={data.security} 
        historyLabels={scoreHistoryLabels}
        historyValues={scoreHistoryValues}
      />
      )}

      {data.licenses && (
        <div id="license-overview" className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">License Overview</h3>
          <LicenseOverview data={data.licenses} />
        </div>
      )}
    </div>
  );
}