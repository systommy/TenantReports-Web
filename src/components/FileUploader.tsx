import { useCallback, useRef, useState } from 'react'
import { ms365Schema } from '../schemas/ms365Schema'

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
    
    // Use setTimeout to allow UI to update with loading state
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

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const onDragLeave = useCallback(() => setDragging(false), [])

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tenant Report</h1>
          <p className="mt-2 text-gray-600">Upload your MS365 security export to generate an interactive report</p>
        </div>
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => !isProcessing && inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
            dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-white'
          } ${isProcessing ? 'opacity-50 cursor-wait' : ''}`}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-gray-700 font-medium">Processing report...</p>
            </div>
          ) : (
            <>
              <div className="text-4xl mb-3">📄</div>
              <p className="text-gray-700 font-medium">Drop your JSON file here</p>
              <p className="text-sm text-gray-500 mt-1">or click to browse</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".json"
            onChange={onChange}
            className="hidden"
            disabled={isProcessing}
          />
        </div>
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        <p className="mt-6 text-center text-xs text-gray-400">
          Your data never leaves your browser. All processing happens locally.
        </p>
      </div>
    </div>
  )
}
