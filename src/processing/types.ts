export interface TenantOverview {
  organization_name: string
  primary_domain: string
  domains_total: number
  generation_date: string
  tenant_id: string
  created_date: string
  total_devices: number
}

export interface Domain {
  domain: string | null
  is_default: boolean
  is_initial: boolean
  is_verified: boolean
  authentication_type: string | null
}

export interface UsersSummary {
  total: number; enabled: number; disabled: number
  licensed: number; unlicensed: number; guest: number
  admin: number; mfa_registered: number; mfa_not_registered: number
  inactive: number; mfa_adoption_rate: number; sspr_adoption_rate: number
}

export interface MfaCoverage {
  adoption_rate: number
  sspr_adoption_rate: number
  methods: Record<string, number>
  total_users: number
  mfa_registered: number
}

export interface AzureSubscription {
  name: string | null; id: string | null
  score: number | null; max_score: number | null; percentage: number | null
}

export interface ControlScore {
  title: string; category: string; status: string
  score: number; max_score: number; score_gap: number; rank: number | null
}

export interface SecurityScores {
  current_score: number | null; max_score: number | null; score_percentage: number | null
  azure_score: number | null; azure_max_score: number | null
  azure_subscriptions: AzureSubscription[]
  history: { date: string; score: number | null }[]
  trend_value: number; trend_direction: 'increase' | 'decrease' | 'stable'
  control_scores: ControlScore[]
  trend_percentage_change: number | null; trend_period_days: number | null
}

export interface MisconfigurationSetting {
  category: string
  name: string
  current_value: string | boolean
  recommended_value: string | boolean
  risk_level: string
  description: string
  recommendation: string
}

export interface TenantConfiguration {
  summary: {
    total: number
    high_risk: number
    medium_risk: number
    low_risk: number
  }
  settings: MisconfigurationSetting[]
}

export interface LicenseItem {
  name: string | null; sku: string | null
  assigned: number; available: number; utilization: number
}

export interface LicenseOverview {
  summary: {
    total_subscriptions: number; active_subscriptions: number
    licenses_purchased: number; licenses_assigned: number
    licenses_available: number; overall_utilization: number
  }
  licenses: LicenseItem[]
}

export interface ConditionalAccessPolicy {
  name: string | null; state: string | null
  requires_mfa: boolean; blocks_access: boolean
  policy_id: string | null; policy_scenario: string | null
  grant_operator: string | null
  requires_compliant_device: boolean; requires_hybrid_join: boolean
  requires_approved_app: boolean; requires_password_change: boolean
  covers_all_users: boolean; covers_all_apps: boolean
  covers_guest_users: boolean; has_exclusions: boolean
  is_high_value_app_protection: boolean
  included_users: string | null; excluded_users: string | null
  included_groups: string | null; excluded_groups: string | null
  included_applications: string | null; excluded_applications: string | null
  included_locations: string | null; excluded_locations: string | null
  platforms: string | null; client_app_types: string | null
  created_date: string; modified_date: string
}

export interface ConditionalAccess {
  summary: { total_policies: number; enabled: number; disabled: number; report_only: number }
  policies: ConditionalAccessPolicy[]
}

export interface ServicePrincipalApp {
  name: string; risk_level: string; consent_type: string | null
  principal: string | null; permissions: { resource: string | null; permission: string | null; risk_level: string | null; consent_type: string | null; principal: string | null }[]
}

export interface ServicePrincipals {
  expiring_credentials: { name: string | null; app_id: string | null; expires_on: string; type: string | null }[]
  all_apps: ServicePrincipalApp[]
  summary: { total: number; critical: number; high: number; medium: number; low: number }
}

export interface DefenderIncidents {
  incidents: { created: string; incident_id: string; title: string | null; severity: string; status: string; classification: string | null; comments: string }[]
  by_severity: Record<string, number>
  by_status: Record<string, number>
  total: number
}

export interface DefenderSummary {
  summary: Record<string, unknown>
  threats: { name: string | null; severity: string | null; category: string | null; detected: string }[]
}

export interface PermissionsSummary {
  permissions: { mailbox: string | null; user: string | null; access: string; is_inherited?: boolean; folder?: string | null }[]
  summary: Record<string, number>
  by_access_type: Record<string, number>
}

export interface AuditEvents {
  group_events: { timestamp: string; activity: string; target: string | null; initiated_by: string | null; group: string | null; status: string | null }[]
  group_activities: Record<string, number>
  user_events: { timestamp: string; activity: string; target: string | null; initiated_by: string | null; status: string | null }[]
  user_activities: Record<string, number>
}

export interface RiskyUser {
  user: string | null; risk_level: string | null; risk_state: string | null; last_updated: string
}

export interface ComplianceOverview {
  intune: Record<string, unknown>
  intune_devices: Record<string, unknown>[]
}

export interface PrivilegedRoles {
  assignments: { role: string; principal: string | null; type: string | null; principal_type: string }[]
  activations: { timestamp: string; activity: string | null; initiated_by: string | null; target_role: string | null; target_user: string | null; result: string | null; reason: string | null }[]
  summary: { total: number; global_admins: number; pim_active_assignments?: number; pim_eligible_assignments?: number; pim_total_assignments?: number }
  by_principal_type: Record<string, number>
}

export interface AppleMdm {
  certificates: { name: string | null; type: string | null; apple_id: string | null; expiration: string; days_left: number | null; status: string | null; serial: string | null }[]
}

export interface LicenseChange {
  timestamp: string
  user: string
  target_user: string
  action: string
  sku: string
}

export interface AppRegistrationSummary {
  TenantId: string
  ReportGeneratedDate: string
  DaysUntilExpiryThreshold: number
  TotalCredentials: number
  ExpiredCount: number
  ExpiringSoonCount: number
  ValidCount: number
  AppsWithExpiredOrExpiring: number
}

export interface AppRegistrationCredential {
  AppDisplayName: string
  AppId: string
  ObjectId: string
  CredentialType: string
  CredentialName: string | null
  KeyId: string
  StartDate: string
  EndDate: string
  DaysRemaining: number
  Status: string
}

export interface AppRegistrationData {
  summary: AppRegistrationSummary | null
  credentials: AppRegistrationCredential[]
}

export interface SharedMailbox {
  display_name: string
  upn: string
  sign_in_enabled: boolean
  has_license: boolean
  is_compliant: boolean
}

export interface ProcessedReport {
  tenant: TenantOverview | null
  domains: Domain[] | null
  configuration: TenantConfiguration | null
  users: UsersSummary | null
  userDetails: Record<string, unknown>[] | null
  mfa: MfaCoverage | null
  security: SecurityScores | null
  licenses: LicenseOverview | null
  licenseChanges: LicenseChange[] | null
  conditionalAccess: ConditionalAccess | null
  servicePrincipals: ServicePrincipals | null
  appCredentials: AppRegistrationData | null
  defenderIncidents: DefenderIncidents | null
  defender: DefenderSummary | null
  mailbox: PermissionsSummary | null
  calendar: PermissionsSummary | null
  audit: AuditEvents | null
  riskyUsers: RiskyUser[] | null
  compliance: ComplianceOverview | null
  sharedMailboxes: SharedMailbox[] | null
  privileged: PrivilegedRoles | null
  appleMdm: AppleMdm | null
  deviceDetails: Record<string, unknown>[] | null
}
