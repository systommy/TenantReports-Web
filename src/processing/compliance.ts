import type { ComplianceOverview, SharedMailbox } from './types'

function getDict(source: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = source[key]
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}
  return value as Record<string, unknown>
}

function toArray(source: unknown): unknown[] {
  if (Array.isArray(source)) return source
  if (typeof source === 'object' && source !== null) return Object.values(source)
  return []
}

function processDevices(data: Record<string, unknown>): Record<string, unknown>[] {
  const intune = getDict(data, 'Intune')
  const rawDevices = intune.DeviceComplianceDetails ?? intune.ManagedDevices
  const devices = toArray(rawDevices) as Record<string, unknown>[]
  
  return devices.map(d => {
    let compliance = d.ComplianceState
    
    // Validate ComplianceState is a string
    if (typeof compliance !== 'string' || !compliance || (typeof compliance === 'object' && Object.keys(compliance).length === 0)) {
       compliance = 'Unknown'
    }

    let owner = d.OwnerType
    if (typeof owner !== 'string' || !owner || (typeof owner === 'object' && Object.keys(owner).length === 0)) {
        owner = 'Unknown'
    }

    return {
        ...d,
        ComplianceState: compliance,
        OwnerType: owner,
        OperatingSystem: d.OperatingSystem ?? 'Unknown',
        DeviceName: d.DeviceName ?? 'Unknown',
        LastSyncDateTime: d.LastSyncDateTime ?? null
    }
  })
}

export function processComplianceOverview(data: Record<string, unknown>): ComplianceOverview {
  const intune = getDict(data, 'Intune')
  const devices = processDevices(data)
  
  return {
    intune: getDict(intune, 'ComplianceSummary'),
    intune_devices: devices,
  }
}

export function processDeviceDetails(data: Record<string, unknown>): Record<string, unknown>[] {
  return processDevices(data)
}

export function processSharedMailboxCompliance(data: Record<string, unknown>): SharedMailbox[] {
  let raw = data.SharedMailboxCompliance
  // Handle nested structure from some JSON versions
  if (raw && typeof raw === 'object' && 'Mailboxes' in raw) {
      raw = (raw as Record<string, unknown>).Mailboxes
  }

  const mailboxes = toArray(raw)
  const rows: SharedMailbox[] = []

  for (const item of mailboxes) {
    if (typeof item !== 'object' || item === null) continue
    const m = item as Record<string, unknown>
    
    // Check various fields for compliance status
    const status = (m.ComplianceStatus as string) ?? ''
    const isCompliant = m.IsCompliant === true || status.toLowerCase() === 'compliant'

    // Check account enabled status
    const enabled = (m.AccountEnabled === true) || (m.SignInEnabled === true)

    rows.push({
      display_name: (m.DisplayName as string) ?? 'Unknown',
      upn: (m.UserPrincipalName as string) ?? '',
      sign_in_enabled: enabled,
      has_license: Boolean(m.HasExchangeLicense),
      is_compliant: isCompliant,
    })
  }
  return rows
}