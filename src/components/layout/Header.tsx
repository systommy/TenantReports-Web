import React from 'react';
import { Search } from 'lucide-react';

interface HeaderProps {
  tenantName: string;
  primaryDomain: string;
  onReset: () => void;
  children?: React.ReactNode; // For ExportButton
}

export default function Header({ tenantName, primaryDomain, onReset, children }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4 flex items-center justify-between print:static print:border-none print:px-0 print:py-0 print:mb-4">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">{tenantName || 'Tenant Overview'}</h2>
          <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 border border-gray-200">{primaryDomain}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 no-print">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search resources..." 
            className="pl-9 pr-4 py-2 bg-gray-100 border-transparent border rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 w-64 transition-all"
          />
        </div>
        
        {children}

        <button 
          onClick={onReset} 
          className="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-600 font-medium text-sm rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          New Report
        </button>
      </div>
    </header>
  );
}
