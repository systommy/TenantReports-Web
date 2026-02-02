import { useState } from 'react'
import { Download, ChevronDown, FileText, Globe } from 'lucide-react'

interface ExportButtonProps {
  onExport: (type: 'pdf' | 'html', scope: 'current' | 'all') => void
  loading: boolean
}

export default function ExportButton({ onExport, loading }: ExportButtonProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (type: 'pdf' | 'html', scope: 'current' | 'all') => {
    setOpen(false)
    onExport(type, scope)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
      >
        <Download size={16} />
        {loading ? 'Exporting...' : 'Export'}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-20 overflow-hidden ring-1 ring-black/5">
            <div className="p-1">
               <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">PDF Report</div>
               <button onClick={() => handleSelect('pdf', 'current')} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md flex items-center gap-2">
                 <FileText size={16} /> Current Page
               </button>
               <button onClick={() => handleSelect('pdf', 'all')} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md flex items-center gap-2">
                 <FileText size={16} /> Complete Report
               </button>
               
               <div className="my-1 border-t border-gray-100"></div>

               <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">HTML Export</div>
               <button onClick={() => handleSelect('html', 'current')} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md flex items-center gap-2">
                 <Globe size={16} /> Current Page
               </button>
                <button onClick={() => handleSelect('html', 'all')} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md flex items-center gap-2">
                 <Globe size={16} /> Complete Report
               </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}