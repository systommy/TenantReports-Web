import { useMemo } from 'react'
import { processAll } from '../processing'
import type { ProcessedReport } from '../processing/types'

export function useReportData(rawData: Record<string, unknown>): ProcessedReport {
  return useMemo(() => processAll(rawData), [rawData])
}
