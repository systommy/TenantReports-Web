import type { ProcessedReport } from './types'
import { processTenantOverview, processDomains, processTenantConfiguration } from './tenant'
import { processUsersSummary, processUserDetails } from './users'
import { processMfaCoverage } from './mfa'
import { processSecurityScores } from './secureScore'
import { processLicenseOverview, processLicenseChanges } from './licenses'
import { processConditionalAccess } from './conditionalAccess'
import { processServicePrincipals, processAppCredentials } from './servicePrincipals'
import { processSentinelIncidents } from './sentinel'
import { processDefenderSummary } from './defender'
import { processMailboxPermissions, processCalendarPermissions } from './permissions'
import { processAuditEvents } from './audit'
import { processRiskyUsers } from './riskyUsers'
import { processComplianceOverview, processDeviceDetails, processSharedMailboxCompliance } from './compliance'
import { processPrivilegedRoles } from './privilegedRoles'
import { processAppleMdm } from './appleMdm'

export function processAll(data: Record<string, unknown>): ProcessedReport {
  return {
    tenant: processTenantOverview(data),
    domains: processDomains(data),
    configuration: processTenantConfiguration(data),
    users: processUsersSummary(data),
    userDetails: processUserDetails(data),
    mfa: processMfaCoverage(data),
    security: processSecurityScores(data),
    licenses: processLicenseOverview(data),
    licenseChanges: processLicenseChanges(data),
    conditionalAccess: processConditionalAccess(data),
    servicePrincipals: processServicePrincipals(data),
    appCredentials: processAppCredentials(data),
    sentinel: processSentinelIncidents(data),
    defender: processDefenderSummary(data),
    mailbox: processMailboxPermissions(data),
    calendar: processCalendarPermissions(data),
    audit: processAuditEvents(data),
    riskyUsers: processRiskyUsers(data),
    compliance: processComplianceOverview(data),
    sharedMailboxes: processSharedMailboxCompliance(data),
    privileged: processPrivilegedRoles(data),
    appleMdm: processAppleMdm(data),
    deviceDetails: processDeviceDetails(data),
  }
}

export { processTenantOverview, processDomains, processTenantConfiguration } from './tenant'
export { processUsersSummary, processUserDetails } from './users'
export { processMfaCoverage } from './mfa'
export { processSecurityScores } from './secureScore'
export { processLicenseOverview, processLicenseChanges } from './licenses'
export { processConditionalAccess } from './conditionalAccess'
export { processServicePrincipals, processAppCredentials } from './servicePrincipals'
export { processSentinelIncidents } from './sentinel'
export { processDefenderSummary } from './defender'
export { processMailboxPermissions, processCalendarPermissions } from './permissions'
export { processAuditEvents } from './audit'
export { processRiskyUsers } from './riskyUsers'
export { processComplianceOverview, processDeviceDetails, processSharedMailboxCompliance } from './compliance'
export { processPrivilegedRoles } from './privilegedRoles'
export { processAppleMdm } from './appleMdm'
