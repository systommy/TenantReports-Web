import { useState } from 'react'
import FileUploader from './components/FileUploader'
import ReportViewer from './components/ReportViewer'

export default function App() {
  const [rawData, setRawData] = useState<Record<string, unknown> | null>(null)

  if (!rawData) return <FileUploader onData={setRawData} />
  
  return <ReportViewer rawData={rawData} onReset={() => setRawData(null)} />
}
