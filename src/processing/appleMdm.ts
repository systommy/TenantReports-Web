import { formatDate } from '../utils/format'
import type { AppleMdm } from './types'

function getDict(source: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = source[key]
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}
  return value as Record<string, unknown>
}

export function processAppleMdm(data: Record<string, unknown>): AppleMdm | null {
  if (!('Apple' in data)) return null
  const apple = getDict(data, 'Apple')
  const allItems = Array.isArray(apple.AllItems) ? apple.AllItems : []

  if (allItems.length === 0) return { certificates: [] }

  const certificates: AppleMdm['certificates'] = []
  for (const item of allItems) {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) continue
    const it = item as Record<string, unknown>
    certificates.push({
      name: (it.Name as string) ?? null,
      type: (it.Type as string) ?? null,
      apple_id: (it.AppleIdentifier as string) ?? null,
      expiration: formatDate(it.ExpirationDateTime as string | null),
      days_left: (it.DaysUntilExpiry as number) ?? null,
      status: (it.Status as string) ?? null,
      serial: (it.CertificateSerialNumber as string) ?? null,
    })
  }

  return { certificates }
}
