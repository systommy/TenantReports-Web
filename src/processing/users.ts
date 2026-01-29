import type { UsersSummary } from './types'

function getDict(source: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = source[key]
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}
  return value as Record<string, unknown>
}

export function processUsersSummary(data: Record<string, unknown>): UsersSummary {
  const users = getDict(data, 'Users')
  const summary = getDict(users, 'Summary')
  return {
    total: (summary.TotalUsers as number) ?? 0,
    enabled: (summary.EnabledUsers as number) ?? 0,
    disabled: (summary.DisabledUsers as number) ?? 0,
    licensed: (summary.LicensedUsers as number) ?? 0,
    unlicensed: (summary.UnlicensedUsers as number) ?? 0,
    guest: (summary.GuestUsers as number) ?? 0,
    admin: (summary.AdminUsers as number) ?? 0,
    mfa_registered: (summary.MfaRegisteredUsers as number) ?? 0,
    mfa_not_registered: (summary.MfaNotRegisteredUsers as number) ?? 0,
    inactive: (summary.InactiveUsers as number) ?? 0,
    mfa_adoption_rate: (summary.MfaAdoptionRate as number) ?? 0,
    sspr_adoption_rate: (summary.SsprAdoptionRate as number) ?? 0,
  }
}

export function processUserDetails(data: Record<string, unknown>): Record<string, unknown>[] {
  const users = getDict(data, 'Users')
  const details = Array.isArray(users.UserDetails) ? users.UserDetails : []
  const result: Record<string, unknown>[] = []

  for (const user of details) {
    if (typeof user !== 'object' || user === null || Array.isArray(user)) continue
    const u = { ...(user as Record<string, unknown>) }

    if (!('IsLicensed' in u)) {
      const count = u.LicenseCount
      u.IsLicensed = typeof count === 'number' ? count > 0 : false
    }
    if (!('City' in u)) u.City = ''
    if (!('UserType' in u)) u.UserType = 'Member'
    if (!('AccountEnabled' in u)) u.AccountEnabled = false

    result.push(u)
  }
  return result
}
