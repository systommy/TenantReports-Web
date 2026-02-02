import { useState, useEffect } from 'react'
import { useReportData } from '../hooks/useReportData'
import MainLayout from './layout/MainLayout'
import type { TabId } from './layout/Sidebar'
import ExportButton from './ExportButton'
import { exportHtml } from '../utils/exportHtml'

import OverviewTab from './sections/OverviewTab'
import IdentityTab from './sections/IdentityTab'
import SecurityTab from './sections/SecurityTab'
import ComplianceTab from './sections/ComplianceTab'
import AuditTab from './sections/AuditTab'

export default function ReportViewer({ rawData, onReset }: { rawData: Record<string, unknown>; onReset: () => void }) {
  const report = useReportData(rawData)
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [exportState, setExportState] = useState<{ type: 'pdf' | 'html'; scope: 'current' | 'all'; status: 'idle' | 'ready' }>({ 
    type: 'pdf', scope: 'current', status: 'idle' 
  })

  useEffect(() => {
    if (exportState.status === 'ready') {
      const timer = setTimeout(() => {
         const filename = `TenantReport_${report.tenant.organization_name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}`

         if (exportState.type === 'pdf') {
             window.print();
         } else {
             exportHtml('report-content', `${filename}.html`, `${report.tenant.organization_name} - Tenant Report`)
         }
         
         setExportState(prev => ({ ...prev, status: 'idle' }))
      }, 500); // Allow time for charts/layout to settle
      return () => clearTimeout(timer);
    }
  }, [exportState.status, exportState.type, report.tenant.organization_name]);

  const handleExport = (type: 'pdf' | 'html', scope: 'current' | 'all') => {
      setExportState({ type, scope, status: 'ready' })
  }

  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab data={report} />
      case 'identity': return <IdentityTab data={report} />
      case 'security': return <SecurityTab data={report} />
      case 'compliance': return <ComplianceTab data={report} />
      case 'audit': return <AuditTab data={report} />
      default: return <div>Select a tab</div>
    }
  }

  const renderAllTabs = () => (
    <div className="space-y-8">
        <div className="print-break-after">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-indigo-600 text-indigo-900">Executive Overview</h2>
            <OverviewTab data={report} />
        </div>
        
        <div className="print-break"></div>

        <div className="print-break-after">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-indigo-600 text-indigo-900">Identity & Access</h2>
            <IdentityTab data={report} />
        </div>

        <div className="print-break"></div>

        <div className="print-break-after">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-indigo-600 text-indigo-900">Security Incidents</h2>
            <SecurityTab data={report} />
        </div>

        <div className="print-break"></div>

        <div className="print-break-after">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-indigo-600 text-indigo-900">Compliance Status</h2>
            <ComplianceTab data={report} />
        </div>

        <div className="print-break"></div>

        <div className="print-break-after">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-indigo-600 text-indigo-900">Audit Events</h2>
            <AuditTab data={report} />
        </div>
    </div>
  )

  const isExportingAll = exportState.scope === 'all' && exportState.status === 'ready';

  return (
    <MainLayout
      tenantName={report.tenant.organization_name}
      primaryDomain={report.tenant.primary_domain}
      onReset={onReset}
      exportButton={<ExportButton onExport={handleExport} loading={exportState.status === 'ready'} />}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <div className="p-8 max-w-7xl mx-auto" id="report-content">
        {isExportingAll ? renderAllTabs() : renderCurrentTab()}
      </div>
    </MainLayout>
  )
}
