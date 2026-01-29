import type { PermissionsSummary } from './types'

function getDict(source: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = source[key]
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}
  return value as Record<string, unknown>
}

export function processMailboxPermissions(data: Record<string, unknown>): PermissionsSummary {
  const mbData = getDict(data, 'MailboxPermissions')
  const perms = Array.isArray(mbData.MailboxPermissions) ? mbData.MailboxPermissions : []

  const rows: PermissionsSummary['permissions'] = []
  const uniqueMailboxes = new Set<string>()
  const accessCounts: Record<string, number> = {}

  for (const p of perms) {
    if (typeof p !== 'object' || p === null || Array.isArray(p)) continue
    const perm = p as Record<string, unknown>
    const mailbox = (perm.MailboxDisplayName as string) || (perm.MailboxIdentity as string) || null
    const access = (perm.AccessRights as string) ?? ''

    rows.push({
      mailbox,
      user: (perm.GrantedTo as string) ?? null,
      access,
      is_inherited: perm.IsInherited as boolean | undefined,
    })

    if (mailbox) uniqueMailboxes.add(mailbox)
    const accessKey = access || 'Other'
    accessCounts[accessKey] = (accessCounts[accessKey] ?? 0) + 1
  }

  return {
    permissions: rows,
    summary: {
      total_mailboxes: uniqueMailboxes.size,
      total_permissions: rows.length,
      full_access: accessCounts['FullAccess'] ?? 0,
      send_as: accessCounts['SendAs'] ?? 0,
    },
    by_access_type: accessCounts,
  }
}

export function processCalendarPermissions(data: Record<string, unknown>): PermissionsSummary {
  const calData = getDict(data, 'CalendarPermissions')
  const perms = Array.isArray(calData.CalendarPermissions) ? calData.CalendarPermissions : []

  const rows: PermissionsSummary['permissions'] = []
  const uniqueCalendars = new Set<string>()
  const accessCounts: Record<string, number> = {}

  for (const p of perms) {
    if (typeof p !== 'object' || p === null || Array.isArray(p)) continue
    const perm = p as Record<string, unknown>
    const mailbox = (perm.MailboxDisplayName as string) || (perm.Mailbox as string) || null
    const access = (perm.AccessRights as string) ?? ''

    rows.push({
      mailbox,
      user: (perm.GrantedTo as string) ?? null,
      access,
      folder: (perm.FolderPath as string) ?? null,
    })

    if (mailbox) uniqueCalendars.add(mailbox)
    const accessKey = access || 'Other'
    accessCounts[accessKey] = (accessCounts[accessKey] ?? 0) + 1
  }

  return {
    permissions: rows,
    summary: {
      total_calendars: uniqueCalendars.size,
      total_permissions: rows.length,
    },
    by_access_type: accessCounts,
  }
}
