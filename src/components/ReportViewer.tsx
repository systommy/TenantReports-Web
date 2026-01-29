import { useReportData } from '../hooks/useReportData'
import ReportNav from './ReportNav'
import ExportButton from './ExportButton'

import TenantOverview from './sections/TenantOverview'
import UserMetrics from './sections/UserMetrics'
import ComplianceOverview from './sections/ComplianceOverview'
import SecurityScores from './sections/SecurityScores'
import MfaCoverage from './sections/MfaCoverage'
import LicenseOverview from './sections/LicenseOverview'
import ExpiringCredentials from './sections/ExpiringCredentials'
import ConditionalAccess from './sections/ConditionalAccess'
import AppleMdm from './sections/AppleMdm'
import ServicePrincipals from './sections/ServicePrincipals'
import PrivilegedAccess from './sections/PrivilegedAccess'
import SentinelIncidents from './sections/SentinelIncidents'
import DefenderSummary from './sections/DefenderSummary'
import RiskyUsers from './sections/RiskyUsers'
import MailboxPermissions from './sections/MailboxPermissions'
import CalendarPermissions from './sections/CalendarPermissions'
import AuditEvents from './sections/AuditEvents'

export default function ReportViewer({ rawData, onReset }: { rawData: Record<string, unknown>; onReset: () => void }) {
  const report = useReportData(rawData)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white shadow no-print">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-bold">Security Report — {report.tenant.organization_name}</h1>
          <div className="flex gap-2">
            <ExportButton report={report} />
            <button onClick={onReset} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium transition-colors">New Report</button>
          </div>
        </div>
        <ReportNav report={report} />
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8" id="report-content">
        <TenantOverview data={report.tenant} domains={report.domains} />
        <UserMetrics data={report.users} details={report.userDetails} />
        <ComplianceOverview data={report.compliance} devices={report.deviceDetails} />
        <SecurityScores data={report.security} />
        <MfaCoverage data={report.mfa} />
        <LicenseOverview data={report.licenses} />
        <ExpiringCredentials credentials={report.servicePrincipals?.expiring_credentials} />
        
        <ConditionalAccess data={report.conditionalAccess} />
        <AppleMdm data={report.appleMdm} />
        <ServicePrincipals data={report.servicePrincipals} />
        <PrivilegedAccess data={report.privileged} />
        <SentinelIncidents data={report.sentinel} />
        <DefenderSummary data={report.defender} />
        <RiskyUsers data={report.riskyUsers} />
        <MailboxPermissions data={report.mailbox} />
        <CalendarPermissions data={report.calendar} />
        <AuditEvents data={report.audit} />
      </main>
    </div>
  )
}
