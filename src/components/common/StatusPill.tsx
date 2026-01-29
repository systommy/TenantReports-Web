export type BadgeIntent = 'success' | 'warning' | 'danger' | 'neutral' | 'info';

interface StatusPillProps {
  label: string;
  intent?: BadgeIntent;
  size?: 'sm' | 'xs';
}

export default function StatusPill({ label, intent = 'neutral', size = 'xs' }: StatusPillProps) {
  const styles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    danger: 'bg-rose-50 text-rose-700 border-rose-100',
    neutral: 'bg-gray-100 text-gray-700 border-gray-200',
    info: 'bg-indigo-50 text-indigo-700 border-indigo-100'
  };

  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-sm' : 'px-2 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center rounded-full font-bold border ${styles[intent]} ${sizeClasses}`}>
      {label}
    </span>
  );
}
