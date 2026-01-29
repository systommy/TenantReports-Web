import { formatDate } from '../utils/format'
import type { AuditEvents } from './types'

export function processAuditEvents(data: Record<string, unknown>): AuditEvents {
  const groupAudit = Array.isArray(data.GroupMembershipAudit) ? data.GroupMembershipAudit : []
  const userAudit = Array.isArray(data.UserCreationAudit) ? data.UserCreationAudit : []

  const groupEvents: AuditEvents['group_events'] = []
  const groupActivities: Record<string, number> = {}

  for (const item of groupAudit) {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) continue
    const it = item as Record<string, unknown>
    const targetUser = (it.TargetUserUPN as string) ?? ''
    const targetDevice = (it.TargetDeviceName as string) ?? ''
    const target = targetUser || targetDevice || null
    const activity = (it.Activity as string) ?? ''

    groupEvents.push({
      timestamp: formatDate(it.Timestamp as string | null),
      activity,
      target,
      initiated_by: (it.InitiatedBy as string) ?? null,
      group: (it.TargetGroupName as string) ?? null,
      status: (it.Result as string) ?? null,
    })

    if (activity) groupActivities[activity] = (groupActivities[activity] ?? 0) + 1
  }

  const userEvents: AuditEvents['user_events'] = []
  const userActivities: Record<string, number> = {}

  for (const item of userAudit) {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) continue
    const it = item as Record<string, unknown>
    const activity = (it.Activity as string) ?? ''

    userEvents.push({
      timestamp: formatDate(it.Timestamp as string | null),
      activity,
      target: (it.TargetUserUPN as string) ?? null,
      initiated_by: (it.InitiatedBy as string) ?? null,
      status: (it.Result as string) ?? null,
    })

    if (activity) userActivities[activity] = (userActivities[activity] ?? 0) + 1
  }

  return { group_events: groupEvents, group_activities: groupActivities, user_events: userEvents, user_activities: userActivities }
}
