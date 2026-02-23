import { formatDate } from '../utils/format'
import type { PrivilegedRoles } from './types'

function getDict(source: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = source[key]
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}
  return value as Record<string, unknown>
}

export function processPrivilegedRoles(data: Record<string, unknown>): PrivilegedRoles | null {
  if (!('PrivilegedAccess' in data) && !('PrivilegedRoles' in data)) return null
  const legacyPrivAccess = getDict(data, 'PrivilegedAccess')

  let rolesData = getDict(data, 'PrivilegedRoles')
  if (Object.keys(rolesData).length === 0) rolesData = getDict(legacyPrivAccess, 'PrivilegedRoles')

  let pimData = getDict(data, 'PIM')
  if (Object.keys(pimData).length === 0) pimData = getDict(legacyPrivAccess, 'PIM')

  const assignments: Record<string, unknown>[] = []
  if (Array.isArray(rolesData.PermanentAssignments)) {
    assignments.push(...(rolesData.PermanentAssignments as Record<string, unknown>[]))
  }
  if (Object.keys(pimData).length > 0) {
    for (const key of ['PIMActiveAssignments', 'PIMEligibleAssignments']) {
      if (Array.isArray(pimData[key])) {
        assignments.push(...(pimData[key] as Record<string, unknown>[]))
      }
    }
  }

  const activationsRaw = Array.isArray(rolesData.RoleActivations) ? rolesData.RoleActivations : []

  const rows: PrivilegedRoles['assignments'] = []
  let globalAdminCount = 0
  const principalTypeCounts: Record<string, number> = {}
  const seenIds = new Set<string>()

  for (const assign of assignments) {
    if (typeof assign !== 'object' || assign === null || Array.isArray(assign)) continue
    const a = assign as Record<string, unknown>

    const assignmentId = a.AssignmentId as string | undefined
    if (assignmentId) {
      if (seenIds.has(assignmentId)) continue
      seenIds.add(assignmentId)
    }

    const roleName = (a.RoleName as string) ?? ''
    const principalType = (a.PrincipalType as string) ?? 'Unknown'

    rows.push({
      role: roleName,
      principal: (a.PrincipalUPN as string) || (a.PrincipalName as string) || null,
      type: (a.AssignmentType as string) ?? null,
      principal_type: principalType,
    })

    if (roleName && roleName.toLowerCase().includes('global administrator')) {
      globalAdminCount++
    }
    principalTypeCounts[principalType] = (principalTypeCounts[principalType] ?? 0) + 1
  }

  const activationRows: PrivilegedRoles['activations'] = []
  for (const activation of activationsRaw) {
    if (typeof activation !== 'object' || activation === null || Array.isArray(activation)) continue
    const act = activation as Record<string, unknown>
    activationRows.push({
      timestamp: formatDate(act.ActivityDateTime as string | null),
      activity: (act.ActivityDisplayName as string) ?? null,
      initiated_by: (act.InitiatedBy as string) ?? null,
      target_role: (act.TargetRole as string) ?? null,
      target_user: (act.TargetUserPrincipalName as string) ?? null,
      result: (act.Result as string) ?? null,
      reason: (act.ResultReason as string) ?? null,
    })
  }

  const pimSummaryRaw = getDict(pimData, 'Summary')
  let pimSummary: PrivilegedRoles['pim_summary'] = null
  if (Object.keys(pimSummaryRaw).length > 0) {
    pimSummary = {
      total_assignments: (pimSummaryRaw.TotalPIMAssignments as number) ?? 0,
      eligible_assignments: (pimSummaryRaw.PIMEligibleAssignments as number) ?? 0,
      active_assignments: (pimSummaryRaw.PIMActiveAssignments as number) ?? 0,
      unique_eligible_users: (pimSummaryRaw.UniqueEligibleUsers as number) ?? 0,
      eligible_global_admins: (pimSummaryRaw.EligibleGlobalAdministrators as number) ?? 0,
      active_global_admins: (pimSummaryRaw.ActiveGlobalAdministrators as number) ?? 0,
    }
  }

  const assignmentsByRole: PrivilegedRoles['assignments_by_role'] = []
  if (Array.isArray(pimData.AssignmentsByRole)) {
    for (const item of pimData.AssignmentsByRole) {
      if (typeof item === 'object' && item !== null) {
        const i = item as Record<string, unknown>
        assignmentsByRole.push({
          role: (i.RoleName as string) ?? 'Unknown',
          eligible: (i.EligibleCount as number) ?? 0,
          active: (i.ActiveCount as number) ?? 0,
        })
      }
    }
  }

  const summaryResult: PrivilegedRoles['summary'] = {
    total: rows.length,
    global_admins: globalAdminCount,
  }
  if (Object.keys(pimSummaryRaw).length > 0) {
    summaryResult.pim_active_assignments = (pimSummaryRaw.PIMActiveAssignments as number) ?? 0
    summaryResult.pim_eligible_assignments = (pimSummaryRaw.PIMEligibleAssignments as number) ?? 0
    summaryResult.pim_total_assignments = (pimSummaryRaw.TotalPIMAssignments as number) ?? 0
  }

  return {
    assignments: rows,
    activations: activationRows,
    summary: summaryResult,
    pim_summary: pimSummary,
    assignments_by_role: assignmentsByRole,
    by_principal_type: principalTypeCounts,
  }
}
