import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ExpandableStatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  intent?: 'success' | 'warning' | 'danger' | 'neutral';
  trendLabel?: string;
  icon?: React.ElementType;
  children?: React.ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
}

export default function ExpandableStatCard({ 
  title, 
  value, 
  subValue, 
  intent = 'neutral', 
  trendLabel, 
  icon: Icon, 
  children,
  onClick,
  isSelected
}: ExpandableStatCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const colorStyles = {
    neutral: 'text-gray-900 bg-gray-50',
    success: 'text-emerald-700 bg-emerald-50 border-emerald-100',
    danger: 'text-rose-700 bg-rose-50 border-rose-100',
    warning: 'text-amber-700 bg-amber-50 border-amber-100'
  }[intent] || 'text-gray-900 bg-gray-50';

  const handleClick = (e: React.MouseEvent) => {
      if (onClick) {
          e.stopPropagation();
          onClick();
      } else if (children) {
          setIsOpen(!isOpen);
      }
  };

  const activeClass = isSelected 
    ? 'ring-2 ring-indigo-500 border-indigo-500 shadow-md' 
    : isOpen 
        ? 'shadow-lg border-indigo-200 ring-1 ring-indigo-50 relative z-10'
        : 'border-gray-100 shadow-sm hover:shadow-md';

  return (
    <div 
      className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${activeClass}`}
    >
      <div 
        className={`p-5 ${children || onClick ? 'cursor-pointer hover:bg-gray-50/50' : 'cursor-default'}`}
        onClick={handleClick}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            {Icon && <Icon size={16} />}
            {title}
          </div>
          {children && (
            <div className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${isOpen ? 'rotate-180' : ''}`}>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          )}
        </div>
        
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold tracking-tight text-gray-900">{value}</div>
          {subValue && <div className={`text-xs font-bold px-1.5 py-0.5 rounded ${colorStyles}`}>{subValue}</div>}
        </div>
        
        {trendLabel && <div className="mt-2 text-xs text-gray-400 font-mono">{trendLabel}</div>}
      </div>

      {/* Expanded Content */}
      {isOpen && children && (
         <div 
           className="px-5 pb-5 pt-0 border-t border-gray-50 bg-gray-50/30 animate-in slide-in-from-top-1"
           onClick={(e) => e.stopPropagation()}
         >
           <div className="pt-3 text-sm text-gray-600 space-y-2">
             {children}
           </div>
           {/* 
           <div className="mt-3 flex justify-end">
             <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
               View Report <ExternalLink size={12} />
             </button>
           </div>
           */}
         </div>
      )}
    </div>
  );
}
