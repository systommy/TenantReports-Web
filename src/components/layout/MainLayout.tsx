import React from 'react';
import Sidebar, { type TabId } from './Sidebar';
import Header from './Header';
import type { ProcessedReport } from '../../processing/types';

interface MainLayoutProps {
  tenantName: string;
  primaryDomain: string;
  onReset: () => void;
  exportButton?: React.ReactNode;
  children: React.ReactNode;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  report: ProcessedReport;
}

export default function MainLayout({ 
  tenantName, 
  primaryDomain, 
  onReset, 
  exportButton, 
  children,
  activeTab,
  onTabChange,
  report
}: MainLayoutProps) {
  
  return (
    <div className="flex h-full min-h-screen bg-gray-50/50 font-sans">
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} report={report} />
      
      <main className="flex-1 ml-64 flex flex-col">
        <Header 
          tenantName={tenantName} 
          primaryDomain={primaryDomain} 
          onReset={onReset}
        >
          {exportButton}
        </Header>
        
        <div className="flex-1 overflow-y-auto">
          {children}
          
          <footer className="mt-8 py-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} <a href="https://systom.dev" target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">Tom de Leeuw - systom.dev</a>. All rights reserved.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
