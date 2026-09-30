import React from 'react';
import { 
  Layers, 
  FlaskConical, 
  FileText, 
  Clock, 
  Plus, 
  FileCheck, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function CleanDashboard({ 
  onRegisterInstrument, 
  onStartTest, 
  onViewReports, 
  onVerifyPublic,
  currentUser 
}) {
  return (
    <div className="space-y-6">
      
      {/* Page Title & Date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-xs text-slate-500">
            Welcome back, {currentUser?.name || 'Anita Sharma'}!
          </p>
        </div>
        <div className="text-xs font-medium text-slate-500">
          Tuesday, 25 Nov 2025
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: 12 Instruments Registered */}
        <div className="ui-card p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 leading-tight">12</div>
            <div className="text-xs text-slate-500">Instruments Registered</div>
          </div>
        </div>

        {/* Card 2: 8 Tests In Progress */}
        <div className="ui-card p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 leading-tight">8</div>
            <div className="text-xs text-slate-500">Tests In Progress</div>
          </div>
        </div>

        {/* Card 3: 25 Reports Generated */}
        <div className="ui-card p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 leading-tight">25</div>
            <div className="text-xs text-slate-500">Reports Generated</div>
          </div>
        </div>

        {/* Card 4: 2 Pending Review */}
        <div className="ui-card p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-red-50 flex items-center justify-center text-red-600 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 leading-tight">2</div>
            <div className="text-xs text-slate-500">Pending Review</div>
          </div>
        </div>

      </div>

      {/* Main Grid: Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recent Activity Table */}
        <div className="lg:col-span-2 ui-card p-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-900">Recent Activity</h2>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Activity</th>
                  <th className="text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: '25 Nov 2025', activity: 'Instrument WL-2025-017 added', status: 'Success', type: 'success' },
                  { date: '25 Nov 2025', activity: 'Test TR-2025-011 completed', status: 'Success', type: 'success' },
                  { date: '24 Nov 2025', activity: 'Report generated (TR-2025-010)', status: 'Success', type: 'success' },
                  { date: '24 Nov 2025', activity: 'User Rohan Mehta logged in', status: 'Info', type: 'info' },
                  { date: '23 Nov 2025', activity: 'Instrument WL-2025-016 added', status: 'Success', type: 'success' },
                ].map((act, idx) => (
                  <tr key={idx}>
                    <td className="text-slate-500 whitespace-nowrap">{act.date}</td>
                    <td className="font-medium text-slate-800">{act.activity}</td>
                    <td className="text-right">
                      <span className={act.type === 'success' ? 'status-badge status-badge-pass' : 'status-badge status-badge-info'}>
                        {act.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Quick Actions Card */}
        <div className="ui-card p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Quick Actions</h2>

          <div className="space-y-2.5">
            <button
              onClick={onRegisterInstrument}
              className="w-full btn-primary py-2.5 text-xs font-semibold justify-center"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Instrument</span>
            </button>

            <button
              onClick={onStartTest}
              className="w-full btn-secondary py-2.5 text-xs font-medium justify-center"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Start New Test</span>
            </button>

            <button
              onClick={onViewReports}
              className="w-full btn-secondary py-2.5 text-xs font-medium justify-center"
            >
              <FileCheck className="w-4 h-4 text-slate-500" />
              <span>View Reports</span>
            </button>

            <button
              onClick={onVerifyPublic}
              className="w-full btn-secondary py-2.5 text-xs font-medium justify-center"
            >
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <span>Verify Report (Public)</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
