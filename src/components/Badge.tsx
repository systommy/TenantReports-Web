import { badgeClasses, type BadgeStyle } from '../utils/badges'

export default function Badge({ label, style }: { label: string; style: BadgeStyle }) {
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${badgeClasses[style]}`}>{label}</span>
}
