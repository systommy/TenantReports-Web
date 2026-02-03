import { useState, useEffect } from 'react'
import { useReportData } from '../hooks/useReportData'
import MainLayout from './layout/MainLayout'
import type { TabId } from './layout/Sidebar'
import ExportButton from './ExportButton'
import { exportHtml } from '../utils/exportHtml'

import DashboardTab from './sections/DashboardTab'
import IdentityAccessTab from './sections/IdentityAccessTab'
import EndpointTab from './sections/EndpointTab'
import ExchangeTab from './sections/ExchangeTab'
import SecurityOpsTab from './sections/SecurityOpsTab'
import LicensingTab from './sections/LicensingTab'
import AuditLogsTab from './sections/AuditLogsTab'

export default function ReportViewer({ rawData, onReset }: { rawData: Record<string, unknown>; onReset: () => void }) {
  const report = useReportData(rawData)
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [exportState, setExportState] = useState<{ type: 'pdf' | 'html'; scope: 'current' | 'all'; status: 'idle' | 'ready' }>({ 
    type: 'pdf', scope: 'current', status: 'idle' 
  })

  const tenantName = report.tenant?.organization_name ?? 'Unknown'

  useEffect(() => {
    if (!report.tenant) return
    if (exportState.status === 'ready') {
      const timer = setTimeout(() => {
         const filename = `TenantReport_${tenantName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}`

         if (exportState.type === 'pdf') {
             window.print();
         } else {
             exportHtml('report-content', `${filename}.html`, `${tenantName} - Tenant Report`)
         }
         
         setExportState(prev => ({ ...prev, status: 'idle' }))
      }, 500); // Allow time for charts/layout to settle
      return () => clearTimeout(timer);
    }
  }, [exportState.status, exportState.type, tenantName, report.tenant]);

  if (!report.tenant) {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
              <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
                  <h2 className="text-xl font-bold text-red-600 mb-2">Invalid Report Data</h2>
                  <p className="text-gray-600 mb-6">Critical tenant information is missing from the uploaded file.</p>
                  <button 
                      onClick={onReset}
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                  >
                      Upload Another File
                  </button>
              </div>
          </div>
      )
  }

  const handleExport = (type: 'pdf' | 'html', scope: 'current' | 'all') => {
      setExportState({ type, scope, status: 'ready' })
  }

  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab data={report} onTabChange={setActiveTab} />
      case 'identity': return <IdentityAccessTab data={report} />
      case 'endpoints': return <EndpointTab data={report} />
      case 'exchange': return <ExchangeTab data={report} />
      case 'security': return <SecurityOpsTab data={report} />
      case 'licensing': return <LicensingTab data={report} />
      case 'audit': return <AuditLogsTab data={report} />
      default: return <div>Select a tab</div>
    }
  }

  const renderAllTabs = () => (
    <div className="space-y-8">
        <div className="print-break-after">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-indigo-600 text-indigo-900">Executive Dashboard</h2>
            <DashboardTab data={report} onTabChange={setActiveTab} />
        </div>
        
        <div className="print-break"></div>

        <div className="print-break-after">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-indigo-600 text-indigo-900">Identity & Access</h2>
            <IdentityAccessTab data={report} />
        </div>

        <div className="print-break"></div>

        <div className="print-break-after">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-indigo-600 text-indigo-900">Endpoint & Device Management</h2>
            <EndpointTab data={report} />
        </div>

        <div className="print-break"></div>

        <div className="print-break-after">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-indigo-600 text-indigo-900">Exchange & Collaboration</h2>
            <ExchangeTab data={report} />
        </div>

        <div className="print-break"></div>

        <div className="print-break-after">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-indigo-600 text-indigo-900">Security Operations</h2>
            <SecurityOpsTab data={report} />
        </div>

        <div className="print-break"></div>

        <div className="print-break-after">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-indigo-600 text-indigo-900">Licensing</h2>
            <LicensingTab data={report} />
        </div>

        <div className="print-break"></div>

        <div className="print-break-after">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-indigo-600 text-indigo-900">Audit Logs</h2>
            <AuditLogsTab data={report} />
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
      report={report}
    >
      <div className="p-8 max-w-[84rem] mx-auto" id="report-content">
        {isExportingAll ? renderAllTabs() : renderCurrentTab()}
      </div>
    </MainLayout>
  )
}

