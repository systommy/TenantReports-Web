const AMS = 'Europe/Amsterdam'
const dtf = new Intl.DateTimeFormat('nl-NL', {
  timeZone: AMS, day: '2-digit', month: '2-digit', year: 'numeric',
  hour: '2-digit', minute: '2-digit', hour12: false,
})

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return ''
  try {
    let s = iso
    if (s.endsWith('Z')) s = s.slice(0, -1) + '+00:00'
    const d = new Date(s)
    if (isNaN(d.getTime())) return iso
    const parts = dtf.formatToParts(d)
    const get = (t: string) => parts.find(p => p.type === t)?.value ?? ''
    return `${get('day')}-${get('month')}-${get('year')} ${get('hour')}:${get('minute')}`
  } catch {
    return iso ?? ''
  }
}

export function pct(value: number | null | undefined, decimals = 1): string {
  if (value == null) return '0%'
  return `${value.toFixed(decimals)}%`
}
