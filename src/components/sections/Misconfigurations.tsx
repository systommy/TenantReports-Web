import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react';
import type { TenantConfiguration } from '../../processing/types';

interface Props {
  data: TenantConfiguration;
}

export default function Misconfigurations({ data }: Props) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newSet = new Set(expandedItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedItems(newSet);
  };

  const sortedSettings = useMemo(() => {
    // Sort by risk (High -> Low) then by Status (Misconfigured -> Configured)
    const riskOrder: Record<string, number> = { 'high': 0, 'medium': 1, 'low': 2, 'info': 3 };
    return [...data.settings].sort((a, b) => {
      const isConfiguredA = a.current_value === a.recommended_value;
      const isConfiguredB = b.current_value === b.recommended_value;
      
      // Prioritize Misconfigured items
      if (isConfiguredA !== isConfiguredB) return isConfiguredA ? 1 : -1;

      // Then by Risk
      const riskA = (a.risk_level || 'info').toLowerCase();
      const riskB = (b.risk_level || 'info').toLowerCase();
      return (riskOrder[riskA] ?? 3) - (riskOrder[riskB] ?? 3);
    });
  }, [data.settings]);

  if (!data.settings.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {sortedSettings.map((item, idx) => {
        const id = `${item.category}-${item.name}-${idx}`;
        const isConfigured = item.current_value === item.recommended_value;
        const isExpanded = expandedItems.has(id);
        
        return (
          <div 
            key={id}
            onClick={() => toggleExpand(id)}
            className={`bg-white rounded-lg border shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md ${
              isConfigured ? 'border-l-4 border-l-emerald-500 border-gray-200' : 'border-l-4 border-l-rose-500 border-rose-100'
            }`}
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-indigo-50 text-indigo-600 tracking-wide">
                      {item.category.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">{item.name}</h4>
                </div>
                <div className={`flex-shrink-0 ${isConfigured ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {isConfigured ? <CheckCircle size={20} /> : <XCircle size={20} />}
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>{isConfigured ? 'Configured as recommended' : 'Action Required'}</span>
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {isExpanded && (
              <div className="px-4 pb-4 pt-0 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="pt-3 border-t border-gray-100 space-y-3">
                  <div>
                    <span className="font-semibold text-gray-900 block text-xs uppercase mb-1">Description</span>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                  
                  {!isConfigured && (
                    <div className="bg-indigo-50 p-3 rounded-md border border-indigo-100">
                      <span className="font-semibold text-indigo-900 block text-xs uppercase mb-1">Recommendation</span>
                      <p className="text-indigo-800">{item.recommendation}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-50 p-2 rounded border border-gray-100">
                      <span className="block text-gray-400 font-bold uppercase mb-1">Current</span>
                      <code className={`font-mono break-all ${isConfigured ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {String(item.current_value)}
                      </code>
                    </div>
                    <div className="bg-gray-50 p-2 rounded border border-gray-100">
                      <span className="block text-gray-400 font-bold uppercase mb-1">Target</span>
                      <code className="font-mono text-gray-700 break-all">
                        {String(item.recommended_value)}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
