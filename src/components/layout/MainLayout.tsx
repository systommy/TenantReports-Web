import React from 'react';
import Sidebar, { type TabId } from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
  tenantName: string;
  primaryDomain: string;
  onReset: () => void;
  exportButton?: React.ReactNode;
  children: React.ReactNode;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function MainLayout({ 
  tenantName, 
  primaryDomain, 
  onReset, 
  exportButton, 
  children,
  activeTab,
  onTabChange 
}: MainLayoutProps) {
  
  return (
    <div className="flex h-full min-h-screen bg-gray-50/50 font-sans">
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
      
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
        </div>
      </main>
    </div>
  );
}
