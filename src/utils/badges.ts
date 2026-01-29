export type BadgeStyle = 'success' | 'danger' | 'warning' | 'info' | 'neutral'

export function severityStyle(level: string | null | undefined): BadgeStyle {
  const s = (level ?? '').toLowerCase()
  if (s === 'high' || s === 'critical') return 'danger'
  if (s === 'medium' || s === 'warning') return 'warning'
  if (s === 'low' || s === 'informational') return 'info'
  return 'neutral'
}

export function statusStyle(status: string | null | undefined): BadgeStyle {
  const s = (status ?? '').toLowerCase()
  if (['active','enabled','success','resolved','on','ok','protected','healthy','compliant','valid','configured','uptodate','up to date'].includes(s)) return 'success'
  if (['disabled','failed','failure','error','critical','at_risk','at risk','non-compliant','off','expired','revoked','invalid'].includes(s)) return 'danger'
  if (['new','open','reportonly','warning','partial','outdated','out of date','pending','patch_available','expiring','expiring soon','nearexpiry','near expiry'].includes(s)) return 'warning'
  return 'neutral'
}

export function boolStyle(flag: unknown): BadgeStyle {
  if (flag === true) return 'success'
  return 'neutral'
}

export function boolLabel(flag: unknown): string {
  if (flag === true) return 'Yes'
  if (flag === false) return 'No'
  return 'Unknown'
}

export const badgeClasses: Record<BadgeStyle, string> = {
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  danger: 'bg-rose-50 text-rose-700 border border-rose-100',
  warning: 'bg-amber-50 text-amber-700 border border-amber-100',
  info: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
  neutral: 'bg-gray-100 text-gray-700 border border-gray-200',
}
