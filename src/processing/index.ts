import type { ProcessedReport } from './types'
import { processTenantOverview, processDomains } from './tenant'
import { processUsersSummary, processUserDetails } from './users'
import { processMfaCoverage } from './mfa'
import { processSecurityScores } from './secureScore'
import { processLicenseOverview } from './licenses'
import { processConditionalAccess } from './conditionalAccess'
import { processServicePrincipals } from './servicePrincipals'
import { processSentinelIncidents } from './sentinel'
import { processDefenderSummary } from './defender'
import { processMailboxPermissions, processCalendarPermissions } from './permissions'
import { processAuditEvents } from './audit'
import { processRiskyUsers } from './riskyUsers'
import { processComplianceOverview, processDeviceDetails } from './compliance'
import { processPrivilegedRoles } from './privilegedRoles'
import { processAppleMdm } from './appleMdm'

export function processAll(data: Record<string, unknown>): ProcessedReport {
  return {
    tenant: processTenantOverview(data),
    domains: processDomains(data),
    users: processUsersSummary(data),
    userDetails: processUserDetails(data),
    mfa: processMfaCoverage(data),
    security: processSecurityScores(data),
    licenses: processLicenseOverview(data),
    conditionalAccess: processConditionalAccess(data),
    servicePrincipals: processServicePrincipals(data),
    sentinel: processSentinelIncidents(data),
    defender: processDefenderSummary(data),
    mailbox: processMailboxPermissions(data),
    calendar: processCalendarPermissions(data),
    audit: processAuditEvents(data),
    riskyUsers: processRiskyUsers(data),
    compliance: processComplianceOverview(data),
    privileged: processPrivilegedRoles(data),
    appleMdm: processAppleMdm(data),
    deviceDetails: processDeviceDetails(data),
  }
}

export { processTenantOverview, processDomains } from './tenant'
export { processUsersSummary, processUserDetails } from './users'
export { processMfaCoverage } from './mfa'
export { processSecurityScores } from './secureScore'
export { processLicenseOverview } from './licenses'
export { processConditionalAccess } from './conditionalAccess'
export { processServicePrincipals } from './servicePrincipals'
export { processSentinelIncidents } from './sentinel'
export { processDefenderSummary } from './defender'
export { processMailboxPermissions, processCalendarPermissions } from './permissions'
export { processAuditEvents } from './audit'
export { processRiskyUsers } from './riskyUsers'
export { processComplianceOverview, processDeviceDetails } from './compliance'
export { processPrivilegedRoles } from './privilegedRoles'
export { processAppleMdm } from './appleMdm'
