import React, { useState } from 'react';
import type { ProcessedReport } from '../../processing/types';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Users, 
  CheckCircle, 
  Activity,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

export type TabId = 'overview' | 'identity' | 'security' | 'compliance' | 'audit';

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  report: ProcessedReport;
}

const NavItem = ({ 
  icon: Icon, 
  label, 
  isActive, 
  isExpanded,
  onToggleExpand,
  onClick,
  subsections 
}: { 
  id: TabId; 
  icon: React.ElementType; 
  label: string; 
  isActive: boolean;
  isExpanded: boolean;
  onToggleExpand: (e: React.MouseEvent) => void;
  onClick: () => void;
  subsections?: { id: string; label: string }[];
}) => {
  const scrollToSection = (e: React.MouseEvent, sectionId: string) => {
    e.stopPropagation();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
        const headers = Array.from(document.querySelectorAll('h3'));
        const header = headers.find(h => h.textContent?.toLowerCase().includes(sectionId.replace(/-/g, ' ').toLowerCase()));
        if (header) header.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-1 mb-1">
      <div className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive 
            ? 'bg-indigo-50 text-indigo-700' 
            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        <button onClick={onClick} className="flex-1 flex items-center gap-3 text-left">
          <Icon size={18} />
          {label}
        </button>
        {subsections && subsections.length > 0 && (
          <button 
            onClick={onToggleExpand}
            className={`p-1 rounded hover:bg-black/5 transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        )}
      </div>
      
      {isExpanded && subsections && (
        <div className="pl-10 space-y-1 border-l-2 border-gray-100 ml-4">
          {subsections.map(sub => (
            <button
              key={sub.id}
              onClick={(e) => {
                if (!isActive) onClick();
                setTimeout(() => scrollToSection(e, sub.id), 100);
              }}
              className="block w-full text-left text-xs text-gray-500 hover:text-indigo-600 py-1 transition-colors truncate"
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Sidebar({ activeTab, onTabChange, report }: SidebarProps) {
  // Dynamic sections based on report data
  const sections: Record<TabId, { id: string; label: string }[]> = {
    overview: [
      { id: 'tenant-overview', label: 'Tenant Overview', visible: !!report.tenant },
      { id: 'misconfigurations', label: 'Common Misconfigurations', visible: !!report.configuration },
      { id: 'ms365-secure-score', label: 'MS365 Secure Score', visible: !!report.security?.current_score },
      { id: 'azure-secure-score', label: 'Azure Secure Score', visible: !!report.security?.azure_score },
      { id: 'mfa-coverage', label: 'MFA Coverage', visible: !!report.mfa },
      { id: 'license-overview', label: 'License Overview', visible: !!report.licenses },
      { id: 'conditional-access-overview', label: 'Conditional Access', visible: !!report.conditionalAccess },
    ].filter(s => s.visible).map(({ id, label }) => ({ id, label })),
    
    identity: [
      { id: 'user-directory', label: 'User Directory', visible: !!report.users },
      { id: 'privileged-access', label: 'Privileged Access', visible: !!report.privileged },
      { id: 'pim-activations', label: 'PIM Activations', visible: !!report.privileged?.activations?.length },
      { id: 'risky-users', label: 'Risky Users', visible: !!report.riskyUsers },
      { id: 'service-principals', label: 'Service Principals', visible: !!report.servicePrincipals },
      { id: 'mailbox-permissions', label: 'Mailbox Permissions', visible: !!report.mailbox },
      { id: 'calendar-permissions', label: 'Calendar Permissions', visible: !!report.calendar },
    ].filter(s => s.visible).map(({ id, label }) => ({ id, label })),
    
    security: [
      { id: 'defender-incidents', label: 'Defender Incidents', visible: !!report.defenderIncidents },
      { id: 'microsoft-defender', label: 'Microsoft Defender', visible: !!report.defender },
      // Removed 'App Security' as it seemed undefined or redundant
    ].filter(s => s.visible).map(({ id, label }) => ({ id, label })),
    
    compliance: [
      { id: 'intune-device-compliance', label: 'Intune Device Compliance', visible: !!report.compliance },
      { id: 'apple-mdm-certificates', label: 'Apple MDM Certificates', visible: !!report.appleMdm },
      { id: 'app-registration-secrets', label: 'App Registration Secrets', visible: !!report.appCredentials },
      { id: 'shared-mailboxes', label: 'Shared Mailbox Compliance', visible: !!report.sharedMailboxes },
    ].filter(s => s.visible).map(({ id, label }) => ({ id, label })),
    
    audit: [
      { id: 'group-modifications', label: 'Group Modifications', visible: !!report.audit?.group_events },
      { id: 'user-modifications', label: 'User Modifications', visible: !!report.audit?.user_events },
      { id: 'license-changes', label: 'Recent License Changes', visible: !!report.licenseChanges },
    ].filter(s => s.visible).map(({ id, label }) => ({ id, label })),
  };

  // Default all expanded
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    overview: true,
    identity: true,
    security: true,
    compliance: true,
    audit: true,
  });

  const toggleExpand = (id: TabId) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className="w-64 border-r border-gray-200 bg-white flex flex-col fixed h-full z-20 no-print">
      <div className="p-6">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-indigo-950">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-indigo-200 shadow-lg">
            <ShieldAlert size={18} />
          </div>
          TenantReport
        </div>
      </div>
      
      <nav className="flex-1 px-4 overflow-y-auto pb-6">
        <NavItem 
          id="overview" 
          icon={LayoutDashboard} 
          label="Overview" 
          isActive={activeTab === 'overview'} 
          isExpanded={expanded.overview}
          onToggleExpand={(e) => { e.stopPropagation(); toggleExpand('overview'); }}
          onClick={() => onTabChange('overview')}
          subsections={sections.overview}
        />
        <NavItem 
          id="identity" 
          icon={Users} 
          label="Identity & Access" 
          isActive={activeTab === 'identity'} 
          isExpanded={expanded.identity}
          onToggleExpand={(e) => { e.stopPropagation(); toggleExpand('identity'); }}
          onClick={() => onTabChange('identity')}
          subsections={sections.identity}
        />
        <NavItem 
          id="security" 
          icon={ShieldAlert} 
          label="Security Incidents" 
          isActive={activeTab === 'security'} 
          isExpanded={expanded.security}
          onToggleExpand={(e) => { e.stopPropagation(); toggleExpand('security'); }}
          onClick={() => onTabChange('security')}
          subsections={sections.security}
        />
        <NavItem 
          id="compliance" 
          icon={CheckCircle} 
          label="Compliance" 
          isActive={activeTab === 'compliance'} 
          isExpanded={expanded.compliance}
          onToggleExpand={(e) => { e.stopPropagation(); toggleExpand('compliance'); }}
          onClick={() => onTabChange('compliance')}
          subsections={sections.compliance}
        />
        <NavItem 
          id="audit" 
          icon={Activity} 
          label="Audit Events" 
          isActive={activeTab === 'audit'} 
          isExpanded={expanded.audit}
          onToggleExpand={(e) => { e.stopPropagation(); toggleExpand('audit'); }}
          onClick={() => onTabChange('audit')}
          subsections={sections.audit}
        />
      </nav>
    </aside>
  );
}
