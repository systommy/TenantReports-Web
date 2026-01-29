import { useState } from 'react'
import type { ProcessedReport } from '../processing/types'
import { exportPdf } from '../utils/exportPdf'
import { exportHtml } from '../utils/exportHtml'

export default function ExportButton({ report }: { report: ProcessedReport }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const filename = `SecurityReport_${report.tenant.organization_name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}`

  const handlePdf = async () => {
    setLoading(true)
    setOpen(false)
    try {
      // We export the entire report content div
      await exportPdf('report-content', `${filename}.pdf`)
    } catch (err) {
      console.error(err)
      alert('Failed to export PDF')
    } finally {
      setLoading(false)
    }
  }

  const handleHtml = () => {
    setOpen(false)
    try {
      exportHtml('report-content', `${filename}.html`, `Security Report - ${report.tenant.organization_name}`)
    } catch (err) {
      console.error(err)
      alert('Failed to export HTML')
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors flex items-center gap-2"
      >
        {loading ? 'Exporting...' : 'Export'}
        <span className="text-xs">▼</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
          <div className="py-1">
            <button
              onClick={handlePdf}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Export as PDF
            </button>
            <button
              onClick={handleHtml}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Export as HTML
            </button>
          </div>
        </div>
      )}
      
      {/* Backdrop to close dropdown */}
      {open && (
        <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
      )}
    </div>
  )
}
