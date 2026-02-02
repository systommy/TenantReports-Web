import React, { useState } from 'react';
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
}

const SECTIONS: Record<TabId, { id: string; label: string }[]> = {
  overview: [
    { id: 'tenant-overview', label: 'Tenant Overview' },
    { id: 'misconfigurations', label: 'Common Misconfigurations' },
    { id: 'ms365-secure-score', label: 'MS365 Secure Score' },
    { id: 'azure-secure-score', label: 'Azure Secure Score' },
    { id: 'mfa-coverage', label: 'MFA Coverage' },
    { id: 'license-overview', label: 'License Overview' },
    { id: 'conditional-access-overview', label: 'Conditional Access' },
  ],
  identity: [
    { id: 'user-directory', label: 'User Directory' },
    { id: 'privileged-access', label: 'Privileged Access' },
    { id: 'pim-activations', label: 'PIM Activations' },
    { id: 'risky-users', label: 'Risky Users' },
    { id: 'service-principals', label: 'Service Principals' },
    { id: 'mailbox-permissions', label: 'Mailbox Permissions' },
    { id: 'calendar-permissions', label: 'Calendar Permissions' },
  ],
  security: [
    { id: 'sentinel-incidents', label: 'Sentinel Incidents' },
    { id: 'microsoft-defender', label: 'Microsoft Defender' },
    { id: 'app-security', label: 'App Security' },
  ],
  compliance: [
    { id: 'intune-device-compliance', label: 'Intune Device Compliance' },
    { id: 'apple-mdm-certificates', label: 'Apple MDM Certificates' },
    { id: 'shared-mailboxes', label: 'Shared Mailbox Compliance' },
  ],
  audit: [
    { id: 'group-modifications', label: 'Group Modifications' },
    { id: 'user-modifications', label: 'User Modifications' },
    { id: 'license-changes', label: 'Recent License Changes' },
  ],
};

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

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
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
          subsections={SECTIONS.overview}
        />
        <NavItem 
          id="identity" 
          icon={Users} 
          label="Identity & Access" 
          isActive={activeTab === 'identity'} 
          isExpanded={expanded.identity}
          onToggleExpand={(e) => { e.stopPropagation(); toggleExpand('identity'); }}
          onClick={() => onTabChange('identity')}
          subsections={SECTIONS.identity}
        />
        <NavItem 
          id="security" 
          icon={ShieldAlert} 
          label="Security Incidents" 
          isActive={activeTab === 'security'} 
          isExpanded={expanded.security}
          onToggleExpand={(e) => { e.stopPropagation(); toggleExpand('security'); }}
          onClick={() => onTabChange('security')}
          subsections={SECTIONS.security}
        />
        <NavItem 
          id="compliance" 
          icon={CheckCircle} 
          label="Compliance" 
          isActive={activeTab === 'compliance'} 
          isExpanded={expanded.compliance}
          onToggleExpand={(e) => { e.stopPropagation(); toggleExpand('compliance'); }}
          onClick={() => onTabChange('compliance')}
          subsections={SECTIONS.compliance}
        />
        <NavItem 
          id="audit" 
          icon={Activity} 
          label="Audit Events" 
          isActive={activeTab === 'audit'} 
          isExpanded={expanded.audit}
          onToggleExpand={(e) => { e.stopPropagation(); toggleExpand('audit'); }}
          onClick={() => onTabChange('audit')}
          subsections={SECTIONS.audit}
        />
      </nav>
    </aside>
  );
}