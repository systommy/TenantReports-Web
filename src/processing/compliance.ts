import type { ComplianceOverview, SharedMailbox } from './types'

function getDict(source: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = source[key]
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}
  return value as Record<string, unknown>
}

export function processComplianceOverview(data: Record<string, unknown>): ComplianceOverview {
  const intune = getDict(data, 'Intune')
  const devices = Array.isArray(intune.ManagedDevices) ? intune.ManagedDevices : []
  
  return {
    intune: getDict(intune, 'ComplianceSummary'),
    intune_devices: devices as Record<string, unknown>[],
  }
}

export function processDeviceDetails(data: Record<string, unknown>): Record<string, unknown>[] {
  const intune = getDict(data, 'Intune')
  return Array.isArray(intune.ManagedDevices) ? (intune.ManagedDevices as Record<string, unknown>[]) : []
}

export function processSharedMailboxCompliance(data: Record<string, unknown>): SharedMailbox[] {
  const mailboxes = Array.isArray(data.SharedMailboxCompliance) ? data.SharedMailboxCompliance : []
  const rows: SharedMailbox[] = []

  for (const item of mailboxes) {
    if (typeof item !== 'object' || item === null) continue
    const m = item as Record<string, unknown>
    rows.push({
      display_name: (m.DisplayName as string) ?? 'Unknown',
      upn: (m.UserPrincipalName as string) ?? '',
      sign_in_enabled: Boolean(m.SignInEnabled),
      has_license: Boolean(m.HasExchangeLicense),
      is_compliant: Boolean(m.IsCompliant),
    })
  }
  return rows
}