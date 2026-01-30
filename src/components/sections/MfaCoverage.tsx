import { useMemo } from 'react'
import BarChart from '../charts/BarChart'
import { pct } from '../../utils/format'
import type { MfaCoverage as MfaCoverageData } from '../../processing/types'

export default function MfaCoverage({ data }: { data: MfaCoverageData }) {
  const methods = useMemo(() => {
    const entries = Object.entries(data.methods).filter(([, v]) => v > 0)
    return { labels: entries.map(([k]) => k), values: entries.map(([, v]) => v) }
  }, [data.methods])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Adoption Rate</div>
            <div className="text-2xl font-bold text-gray-900">{pct(data.adoption_rate)}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Registered Users</div>
            <div className="text-2xl font-bold text-gray-900">{data.mfa_registered}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500 mb-1">Total Users</div>
            <div className="text-2xl font-bold text-gray-900">{data.total_users}</div>
        </div>
      </div>
      {methods.labels.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="h-64">
                <BarChart
                labels={methods.labels}
                datasets={[{ label: 'Count', values: methods.values }]}
                title="MFA Methods"
                horizontal
                />
            </div>
        </div>
      )}
    </div>
  )
}