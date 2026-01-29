import type { MfaCoverage } from './types'
import { processUsersSummary } from './users'

function getDict(source: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = source[key]
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}
  return value as Record<string, unknown>
}

const METHOD_FIELDS: Record<string, string> = {
  MicrosoftAuthenticatorApp: 'Microsoft Authenticator App',
  MicrosoftAuthenticatorPasswordless: 'Microsoft Authenticator Passwordless',
  Fido2SecurityKey: 'FIDO2 Security Key',
  WindowsHelloforBusiness: 'Windows Hello for Business',
  WindowsHelloPasskey: 'Windows Hello Passkey',
  SMS: 'SMS',
  VoiceCall: 'Voice Call',
  Email: 'Email',
  SoftwareOTP: 'Software OTP',
  HardwareOTP: 'Hardware OTP',
  TemporaryAccessPass: 'Temporary Access Pass',
  DeviceBoundPasskey: 'Device Bound Passkey',
  MicrosoftAuthenticatorPasskey: 'Microsoft Authenticator Passkey',
  MacOSSecureEnclaveKey: 'macOS Secure Enclave Key',
  AlternativeMobilePhone: 'Alternative Mobile Phone',
  SecurityQuestions: 'Security Questions',
}

export function processMfaCoverage(data: Record<string, unknown>): MfaCoverage {
  const users = getDict(data, 'Users')
  const details = Array.isArray(users.UserDetails) ? users.UserDetails : []
  const summary = processUsersSummary(data)

  const methodCounts: Record<string, number> = {}
  for (const friendly of Object.values(METHOD_FIELDS)) {
    methodCounts[friendly] = 0
  }

  for (const user of details) {
    if (typeof user !== 'object' || user === null || Array.isArray(user)) continue
    const u = user as Record<string, unknown>
    for (const [field, friendly] of Object.entries(METHOD_FIELDS)) {
      if (u[field]) {
        methodCounts[friendly]++
      }
    }
  }

  const totalEnabled = summary.enabled || 0
  const registered = summary.mfa_registered || 0
  const adoptionRate = totalEnabled ? (registered / totalEnabled) * 100 : 0

  return {
    adoption_rate: adoptionRate,
    sspr_adoption_rate: summary.sspr_adoption_rate ?? 0,
    methods: methodCounts,
    total_users: totalEnabled,
    mfa_registered: registered,
  }
}
