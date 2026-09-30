import React from 'react';
import { 
  Scale, 
  LayoutDashboard, 
  Layers, 
  FileCheck2, 
  ShieldCheck, 
  Cpu, 
  History, 
  Presentation, 
  UserCheck, 
  Sparkles,
  ChevronDown,
  Globe,
  Sliders
} from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  currentUser, 
  users, 
  onSwitchUser, 
  onOpenPitchMode 
}) {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Emblem */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-sky-400 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Scale className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white flex items-center">
                  Smart<span className="text-cyan-400">NAWI</span>
                </span>
                <span className="text-[10px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 px-1.5 py-0.5 rounded">
                  OIML R-76
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-none">
                Govt. of India • Legal Metrology Digital System
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {[
              { id: 'landing', label: 'Overview', icon: Globe },
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'instruments', label: 'Instruments', icon: Layers },
              { id: 'tests', label: 'Test Studio', icon: Cpu },
              { id: 'reports', label: 'Certificates', icon: FileCheck2 },
              { id: 'verification', label: 'QR Verify', icon: ShieldCheck },
              { id: 'rules', label: 'Rule Engine', icon: Sliders },
              { id: 'audit', label: 'Audit Log', icon: History },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Pitch Mode & Persona Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Pitch Deck Interactive Walkthrough Button */}
            <button
              onClick={onOpenPitchMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 hover:brightness-110 shadow-sm transition-all animate-pulse-glow"
              title="Launch Interactive SIH Pitch Presentation Tour"
            >
              <Presentation className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Pitch Mode</span>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </button>

            {/* Persona Switcher Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-2 pl-3 pr-2 py-1 bg-slate-800/80 border border-slate-700/60 rounded-xl cursor-pointer hover:border-slate-600 transition-colors">
                <span className="text-base">{currentUser?.avatar || '👤'}</span>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-semibold text-slate-200 leading-tight">
                    {currentUser?.name || 'User'}
                  </div>
                  <div className="text-[10px] text-cyan-400 leading-none">
                    {currentUser?.roleLabel?.split(' ')[0] || currentUser?.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-transform group-hover:rotate-180" />
              </div>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 hidden group-hover:block z-50">
                <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-1">
                  Active Metrology Persona (RBAC)
                </div>
                {users.map(u => (
                  <button
                    key={u.id}
                    onClick={() => onSwitchUser(u.id)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-left transition-all ${
                      currentUser?.id === u.id
                        ? 'bg-cyan-500/15 text-cyan-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-lg">{u.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-slate-200">{u.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{u.roleLabel}</div>
                    </div>
                    {currentUser?.id === u.id && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 border-t border-slate-800/80 space-x-1 scrollbar-none">
          {[
            { id: 'landing', label: 'Overview', icon: Globe },
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'instruments', label: 'Instruments', icon: Layers },
            { id: 'tests', label: 'Test Studio', icon: Cpu },
            { id: 'reports', label: 'Certificates', icon: FileCheck2 },
            { id: 'verification', label: 'Verify', icon: ShieldCheck },
            { id: 'rules', label: 'Rules', icon: Sliders },
            { id: 'audit', label: 'Audit', icon: History },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
