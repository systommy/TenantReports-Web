export default function MetricCard({ 
  label, 
  value, 
  className,
  onClick,
  isActive 
}: { 
  label: string; 
  value: string | number; 
  className?: string;
  onClick?: () => void;
  isActive?: boolean;
}) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border p-5 transition-all ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      } ${
        isActive 
          ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/20' 
          : 'border-gray-100 hover:border-gray-300'
      } ${className ?? ''}`}
    >
      <div className={`text-3xl font-bold tracking-tight ${isActive ? 'text-blue-700' : 'text-gray-900'}`}>{value}</div>
      <div className={`text-sm font-medium mt-1 uppercase tracking-wide ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>{label}</div>
    </div>
  )
}
