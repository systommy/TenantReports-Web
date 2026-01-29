import React from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Users, 
  CheckCircle, 
  CreditCard, 
  Activity,
} from 'lucide-react';

export type TabId = 'overview' | 'identity' | 'security' | 'compliance' | 'licensing' | 'audit';

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  adminUser?: {
    name: string;
    email: string;
  };
}

const NavItem = ({ icon: Icon, label, isActive, onClick }: { 
  id: TabId; 
  icon: React.ElementType; 
  label: string; 
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive 
        ? 'bg-indigo-50 text-indigo-700' 
        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
    }`}
  >
    <Icon size={18} />
    {label}
  </button>
);

export default function Sidebar({ activeTab, onTabChange, adminUser }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-gray-200 bg-white flex flex-col fixed h-full z-20">
      <div className="p-6">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-indigo-950">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-indigo-200 shadow-lg">
            <ShieldAlert size={18} />
          </div>
          SecReport
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        <NavItem 
          id="overview" 
          icon={LayoutDashboard} 
          label="Overview" 
          isActive={activeTab === 'overview'} 
          onClick={() => onTabChange('overview')} 
        />
        <NavItem 
          id="identity" 
          icon={Users} 
          label="Identity & Access" 
          isActive={activeTab === 'identity'} 
          onClick={() => onTabChange('identity')} 
        />
        <NavItem 
          id="security" 
          icon={ShieldAlert} 
          label="Security Incidents" 
          isActive={activeTab === 'security'} 
          onClick={() => onTabChange('security')} 
        />
        <NavItem 
          id="compliance" 
          icon={CheckCircle} 
          label="Compliance" 
          isActive={activeTab === 'compliance'} 
          onClick={() => onTabChange('compliance')} 
        />
        <NavItem 
          id="licensing" 
          icon={CreditCard} 
          label="Licensing" 
          isActive={activeTab === 'licensing'} 
          onClick={() => onTabChange('licensing')} 
        />
        <NavItem 
          id="audit" 
          icon={Activity} 
          label="Audit Logs" 
          isActive={activeTab === 'audit'} 
          onClick={() => onTabChange('audit')} 
        />
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 border border-indigo-200">
            {adminUser?.name ? adminUser.name.substring(0, 2).toUpperCase() : 'AD'}
          </div>
          <div className="text-sm overflow-hidden">
            <div className="font-medium text-gray-900 truncate">{adminUser?.name || 'Admin User'}</div>
            <div className="text-xs text-gray-500 truncate">{adminUser?.email || 'admin@dif.eu'}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
