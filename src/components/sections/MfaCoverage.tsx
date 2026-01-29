import { useMemo } from 'react'
import Section from '../Section'
import MetricCard from '../MetricCard'
import BarChart from '../charts/BarChart'
import { pct } from '../../utils/format'
import type { MfaCoverage as MfaCoverageData } from '../../processing/types'

export default function MfaCoverage({ data }: { data: MfaCoverageData }) {
  const methods = useMemo(() => {
    const entries = Object.entries(data.methods).filter(([, v]) => v > 0)
    return { labels: entries.map(([k]) => k), values: entries.map(([, v]) => v) }
  }, [data.methods])

  return (
    <Section title="MFA Coverage" id="mfa-coverage">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <MetricCard label="Adoption Rate" value={pct(data.adoption_rate)} />
        <MetricCard label="Registered Users" value={data.mfa_registered} />
        <MetricCard label="Total Users" value={data.total_users} />
      </div>
      {methods.labels.length > 0 && (
        <BarChart
          labels={methods.labels}
          datasets={[{ label: 'Count', values: methods.values }]}
          title="MFA Methods"
          horizontal
        />
      )}
    </Section>
  )
}
