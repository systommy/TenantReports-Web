import { formatDate } from '../utils/format'
import type { ConditionalAccess } from './types'

function getDict(source: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = source[key]
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}
  return value as Record<string, unknown>
}

export function processConditionalAccess(data: Record<string, unknown>): ConditionalAccess | null {
  if (!('ConditionalAccess' in data)) return null
  const caData = getDict(data, 'ConditionalAccess')
  const summary = getDict(caData, 'Summary')
  const policies = Array.isArray(caData.PolicyAnalysis) ? caData.PolicyAnalysis : []

  const policyRows: ConditionalAccess['policies'] = []
  for (const policy of policies) {
    if (typeof policy !== 'object' || policy === null || Array.isArray(policy)) continue
    const p = policy as Record<string, unknown>
    policyRows.push({
      name: (p.PolicyName as string) ?? null,
      state: (p.State as string) ?? null,
      requires_mfa: Boolean(p.RequiresMFA),
      blocks_access: Boolean(p.BlocksAccess),
      policy_id: (p.PolicyId as string) ?? null,
      policy_scenario: (p.PolicyScenario as string) ?? null,
      grant_operator: (p.GrantOperator as string) ?? null,
      requires_compliant_device: Boolean(p.RequiresCompliantDevice),
      requires_hybrid_join: Boolean(p.RequiresHybridJoin),
      requires_approved_app: Boolean(p.RequiresApprovedApp),
      requires_password_change: Boolean(p.RequiresPasswordChange),
      covers_all_users: Boolean(p.CoversAllUsers),
      covers_all_apps: Boolean(p.CoversAllApps),
      covers_guest_users: Boolean(p.CoversGuestUsers),
      has_exclusions: Boolean(p.HasExclusions),
      is_high_value_app_protection: Boolean(p.IsHighValueAppProtection),
      included_users: (p.IncludedUsers as string) ?? null,
      excluded_users: (p.ExcludedUsers as string) ?? null,
      included_groups: (p.IncludedGroups as string) ?? null,
      excluded_groups: (p.ExcludedGroups as string) ?? null,
      included_applications: (p.IncludedApplications as string) ?? null,
      excluded_applications: (p.ExcludedApplications as string) ?? null,
      included_locations: (p.IncludedLocations as string) ?? null,
      excluded_locations: (p.ExcludedLocations as string) ?? null,
      platforms: (p.Platforms as string) ?? null,
      client_app_types: (p.ClientAppTypes as string) ?? null,
      created_date: formatDate(p.CreatedDateTime as string | null),
      modified_date: formatDate(p.ModifiedDateTime as string | null),
    })
  }

  return {
    summary: {
      total_policies: (summary.TotalPolicies as number) ?? 0,
      enabled: (summary.EnabledPolicies as number) ?? 0,
      disabled: (summary.DisabledPolicies as number) ?? 0,
      report_only: (summary.ReportOnlyPolicies as number) ?? 0,
    },
    policies: policyRows,
  }
}
