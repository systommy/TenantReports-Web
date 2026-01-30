import { useState } from 'react'
import { useReportData } from '../hooks/useReportData'
import MainLayout from './layout/MainLayout'
import type { TabId } from './layout/Sidebar'
import ExportButton from './ExportButton'

import OverviewTab from './sections/OverviewTab'
import IdentityTab from './sections/IdentityTab'
import SecurityTab from './sections/SecurityTab'
import ComplianceTab from './sections/ComplianceTab'
import LicenseOverview from './sections/LicenseOverview'
import AuditTab from './sections/AuditTab'

export default function ReportViewer({ rawData, onReset }: { rawData: Record<string, unknown>; onReset: () => void }) {
  const report = useReportData(rawData)
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab data={report} />
      case 'identity':
        return <IdentityTab data={report} />
      case 'security':
        return <SecurityTab data={report} />
      case 'compliance':
        return <ComplianceTab data={report} />
      case 'licensing':
        return <LicenseOverview data={report.licenses} changes={report.licenseChanges} />
      case 'audit':
        return <AuditTab data={report} />
      default:
        return <div>Select a tab</div>
    }
  }

  return (
    <MainLayout
      tenantName={report.tenant.organization_name}
      primaryDomain={report.tenant.primary_domain}
      onReset={onReset}
      exportButton={<ExportButton report={report} />}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <div className="p-8 max-w-7xl mx-auto" id="report-content">
        {renderContent()}
      </div>
    </MainLayout>
  )
}
