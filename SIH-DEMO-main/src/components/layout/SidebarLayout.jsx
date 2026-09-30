import React from 'react';
import { 
  Scale, 
  LayoutDashboard, 
  Layers, 
  FileCheck2, 
  FileText, 
  Users, 
  Sliders, 
  History, 
  Settings, 
  Menu, 
  Bell, 
  LogOut,
  ShieldCheck,
  Presentation
} from 'lucide-react';

export default function SidebarLayout({ 
  currentTab, 
  setCurrentTab, 
  currentUser, 
  onLogout, 
  onOpenPitch,
  children 
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'instruments', label: 'Instruments', icon: Layers },
    { id: 'test_management', label: 'Test Management', icon: Scale },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'rule_engine', label: 'Rule Engine', icon: Sliders },
    { id: 'audit_logs', label: 'Audit Logs', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans antialiased text-slate-900">
      
      {/* Left Dark Navy Sidebar (matching reference images) */}
      <aside className="w-60 bg-[#0d1b2a] text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800 min-h-screen">
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center gap-2.5 px-5 border-b border-slate-800/80">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Scale className="w-5 h-5" />
            </div>
            <div className="text-base font-bold text-white tracking-tight">
              Smart<span className="text-blue-400">NAWI</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = (
                currentTab === item.id || 
                (item.id === 'test_management' && (currentTab === 'tests_new' || currentTab === 'tests_results')) ||
                (item.id === 'instruments' && currentTab === 'instruments_new') ||
                (item.id === 'reports' && currentTab === 'report_view')
              );

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom SIH Pitch Tour & Verify Links */}
        <div className="p-3 border-t border-slate-800/80 space-y-1.5">
          <button
            onClick={onOpenPitch}
            className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
          >
            <Presentation className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>SIH Pitch Deck</span>
          </button>

          <button
            onClick={() => setCurrentTab('verify')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>Public QR Portal</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="text-slate-500 hover:text-slate-700 md:hidden p-1">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-600">National Metrology Testing System</span>
              <span className="text-slate-300">•</span>
              <span className="text-blue-600 font-semibold">OIML R-76-1 Compliant</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell with Dot */}
            <div className="relative cursor-pointer text-slate-500 hover:text-slate-700 p-1">
              <Bell className="w-5 h-5" />
              <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-1 right-1" />
            </div>

            {/* User Avatar & Name */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                A
              </div>
              <div className="text-left leading-tight">
                <div className="text-xs font-semibold text-slate-800">
                  {currentUser?.name || 'Anita Sharma'}
                </div>
                <div className="text-[10px] text-slate-500">
                  {currentUser?.role || 'Lab Technician'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full max-w-6xl">
          {children}
        </main>

      </div>

    </div>
  );
}
