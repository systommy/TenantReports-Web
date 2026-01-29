import { formatDate } from '../utils/format'
import type { ComplianceOverview } from './types'

function getDict(source: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = source[key]
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}
  return value as Record<string, unknown>
}

export function processComplianceOverview(data: Record<string, unknown>): ComplianceOverview {
  const intune = getDict(data, 'Intune')
  const intuneSummary = getDict(intune, 'Summary')
  const intuneDevices = Array.isArray(intune.DeviceComplianceDetails) ? intune.DeviceComplianceDetails : []

  const formattedDevices: Record<string, unknown>[] = []
  for (const device of intuneDevices) {
    if (typeof device === 'object' && device !== null && !Array.isArray(device)) {
      const d = { ...(device as Record<string, unknown>) }
      d.LastSyncDateTime = formatDate(d.LastSyncDateTime as string | null)
      formattedDevices.push(d)
    } else {
      formattedDevices.push(device as Record<string, unknown>)
    }
  }

  return { intune: intuneSummary, intune_devices: formattedDevices }
}

export function processDeviceDetails(data: Record<string, unknown>): Record<string, unknown>[] {
  const intune = getDict(data, 'Intune')

  // Build non-compliant device IDs set
  const nonCompliantIds = new Set<string>()
  const ncList = Array.isArray(intune.NonCompliantDevices) ? intune.NonCompliantDevices : []
  for (const ncDevice of ncList) {
    if (typeof ncDevice === 'object' && ncDevice !== null && !Array.isArray(ncDevice)) {
      const id = (ncDevice as Record<string, unknown>).DeviceId as string | undefined
      if (id) nonCompliantIds.add(id)
    }
  }

  for (const key of ['DeviceComplianceDetails', 'Devices', 'AllDevices', 'ManagedDevices']) {
    const devices = intune[key]
    if (!Array.isArray(devices) || devices.length === 0) continue

    const formatted: Record<string, unknown>[] = []
    for (const device of devices) {
      if (typeof device !== 'object' || device === null || Array.isArray(device)) {
        formatted.push(device as Record<string, unknown>)
        continue
      }
      const d = { ...(device as Record<string, unknown>) }
      if (d.LastSyncDateTime) d.LastSyncDateTime = formatDate(d.LastSyncDateTime as string)
      if (d.EnrolledDateTime) d.EnrolledDateTime = formatDate(d.EnrolledDateTime as string)

      // Fix empty ComplianceState
      const complianceState = d.ComplianceState
      if (!complianceState || (typeof complianceState === 'object' && Object.keys(complianceState as object).length === 0)) {
        const deviceId = d.DeviceId as string | undefined
        d.ComplianceState = deviceId && nonCompliantIds.has(deviceId) ? 'NonCompliant' : 'Compliant'
      }

      // Fix empty OwnerType
      const ownerType = d.OwnerType
      if (!ownerType || (typeof ownerType === 'object' && Object.keys(ownerType as object).length === 0)) {
        d.OwnerType = 'Unknown'
      }

      formatted.push(d)
    }
    return formatted
  }
  return []
}
