import { useCallback, useRef, useState, useEffect } from 'react'
import { ms365Schema } from '../schemas/ms365Schema'
import { FileJson, Github, Globe, UploadCloud, ShieldAlert } from 'lucide-react'

interface Props {
  onData: (data: Record<string, unknown>) => void
}

export default function FileUploader({ onData }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    setError(null)
    setIsProcessing(true)
    
    setTimeout(() => {
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result as string)
          const result = ms365Schema.safeParse(json)
          if (!result.success) {
            const issues = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')
            setError(`Invalid JSON structure: ${issues}`)
            setIsProcessing(false)
            return
          }
          onData(json)
        } catch {
          setError('Failed to parse JSON file.')
          setIsProcessing(false)
        }
      }
      reader.onerror = () => {
        setError('Failed to read file.')
        setIsProcessing(false)
      }
      reader.readAsText(file)
    }, 50)
  }, [onData])

  useEffect(() => {
    const handleWindowDragOver = (e: DragEvent) => {
      e.preventDefault()
      setDragging(true)
    }
    
    const handleWindowDragLeave = (e: DragEvent) => {
      e.preventDefault()
      // Only set dragging to false if we actually leave the window
      if (e.relatedTarget === null) {
        setDragging(false)
      }
    }
    
    const handleWindowDrop = (e: DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer?.files[0]
      if (file) handleFile(file)
    }

    window.addEventListener('dragover', handleWindowDragOver)
    window.addEventListener('dragleave', handleWindowDragLeave)
    window.addEventListener('drop', handleWindowDrop)

    return () => {
      window.removeEventListener('dragover', handleWindowDragOver)
      window.removeEventListener('dragleave', handleWindowDragLeave)
      window.removeEventListener('drop', handleWindowDrop)
    }
  }, [handleFile])

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6 relative">
      {/* Global Drag Overlay */}
      {dragging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-600/20 backdrop-blur-sm border-[6px] border-dashed border-indigo-600 pointer-events-none animate-in fade-in duration-200">
          <div className="bg-white p-12 rounded-3xl shadow-2xl flex flex-col items-center gap-6 scale-110">
             <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center animate-bounce">
               <UploadCloud size={48} />
             </div>
             <p className="text-3xl font-black text-indigo-900 tracking-tight">Drop it anywhere!</p>
          </div>
        </div>
      )}

      <div className="max-w-3xl w-full">
        {/* Header Section */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-200 mb-2">
            <FileJson size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">TenantReport</h1>
          <p className="text-lg text-gray-600 max-w-lg mx-auto leading-relaxed">
            Interactive security visualization for Microsoft 365. 
            Designed to work with the <a href="http://github.com/systommy/TenantReports" target="_blank" rel="noreferrer" className="font-bold text-indigo-900 hover:text-indigo-700 hover:underline transition-all">TenantReports</a> PowerShell module.
          </p>
          
          <div className="flex items-center justify-center gap-4 pt-2">
            <a 
              href="http://github.com/systommy/TenantReports" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm hover:shadow text-sm font-medium"
            >
              <Github size={16} />
              GitHub
            </a>
            <a 
              href="https://systom.dev" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm hover:shadow text-sm font-medium"
            >
              <Globe size={16} />
              systom.dev
            </a>
          </div>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          <div className="p-10">
            <div
              onClick={() => !isProcessing && inputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-20 text-center cursor-pointer transition-all duration-200 group ${
                dragging 
                  ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]' 
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50/50'
              } ${isProcessing ? 'opacity-50 cursor-wait' : ''}`}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".json"
                onChange={onChange}
                className="hidden"
                disabled={isProcessing}
              />
              
              {isProcessing ? (
                <div className="flex flex-col items-center animate-pulse">
                  <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-xl text-indigo-900 font-semibold">Processing report data...</p>
                  <p className="text-sm text-indigo-600 mt-1">This might take a moment</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-200 shadow-sm">
                    <UploadCloud size={40} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">Drop your JSON report here</p>
                    <p className="text-gray-500 mt-2 font-medium">or click to browse your files</p>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                 <div className="text-rose-500 mt-0.5">
                   <ShieldAlert size={18} />
                 </div>
                 <div className="text-sm text-rose-800">
                   <span className="font-semibold block mb-0.5">Upload Failed</span>
                   {error}
                 </div>
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 font-medium">
              Secure & Private: Your data is processed locally in your browser and is never uploaded to any server.
            </p>
          </div>
        </div>
      </div>
      
      <footer className="fixed bottom-4 left-0 right-0 text-center">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} <a href="https://systom.dev" target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">Tom de Leeuw - systom.dev</a>
        </p>
      </footer>
    </div>
  )
}
