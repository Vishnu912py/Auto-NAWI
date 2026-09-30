import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Layers, 
  PlusCircle, 
  ShieldCheck, 
  Zap, 
  ArrowUpRight, 
  ExternalLink,
  Activity,
  Award,
  AlertTriangle,
  Scale
} from 'lucide-react';

export default function Dashboard({ 
  store, 
  onStartNewTest, 
  onViewTest, 
  onViewReport, 
  onNavigateTab,
  onLoadScenario
}) {
  const { tests = [], reports = [], instruments = [], auditLogs = [] } = store;

  const totalTests = tests.length;
  const passTests = tests.filter(t => (t.overallResult || t.status) === 'PASS' || t.status === 'APPROVED').length;
  const failTests = tests.filter(t => t.overallResult === 'FAIL' || t.status === 'REJECTED' || t.status === 'REJECTED_NON_COMPLIANT').length;
  const passRate = totalTests > 0 ? Math.round((passTests / totalTests) * 100) : 100;
  const signedReports = reports.filter(r => r.digitalSignature).length;

  return (
    <div className="space-y-6">
      
      {/* Top Hero Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.15),transparent_70%)] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-cyan">Legal Metrology Portal</span>
              <span className="badge badge-pass flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Rule Engine Online
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Type-Evaluation & Compliance Engine
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Automated OIML R-76 test evaluation for Non-Automatic Weighing Instruments. Real-time Maximum Permissible Error (MPE) verification, tamper-evident certificate issuance, and cryptographic audit ledger.
            </p>
          </div>

          {/* Quick Launch Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={onStartNewTest}
              className="btn-primary flex items-center gap-2 text-sm px-4 py-2.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Test Evaluation</span>
            </button>
            <button 
              onClick={() => onNavigateTab('verification')}
              className="btn-secondary flex items-center gap-2 text-sm px-4 py-2.5"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Verify Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Evaluations */}
        <div className="glass-panel p-5 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Tests</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{totalTests}</span>
            <span className="text-xs text-emerald-400 flex items-center font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" /> 100% Digital
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Across {instruments.length} registered NAWI instruments</p>
        </div>

        {/* Pass Rate */}
        <div className="glass-panel p-5 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">OIML Pass Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono">{passRate}%</span>
            <span className="text-xs text-slate-400">({passTests} Passed)</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${passRate}%` }} />
          </div>
        </div>

        {/* Non-Compliant / Fail */}
        <div className="glass-panel p-5 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">MPE Failures</span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-red-400 font-mono">{failTests}</span>
            <span className="text-xs text-red-300 font-medium">Exceeded Tolerance</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Deterministic rule rejection</p>
        </div>

        {/* Signed Certificates */}
        <div className="glass-panel p-5 relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Signed Certificates</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{signedReports}</span>
            <span className="badge badge-purple text-[10px]">SHA-256 PKI</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Tamper-evident legal documents</p>
        </div>

      </div>

      {/* Demo Scenario Fast Pitch Bar */}
      <div className="glass-panel p-4 bg-slate-900/60 border border-cyan-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">Judge Demo Presets (1-Click)</div>
              <div className="text-xs text-slate-400">Instantly test standard compliant vs out-of-tolerance scenarios</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onLoadScenario('PERFECT_PASS')}
              className="px-3 py-1.5 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-600/50 hover:bg-emerald-900/80 text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Load Pass Scenario (Class III Scale)</span>
            </button>
            <button
              onClick={() => onLoadScenario('OUT_OF_TOLERANCE_FAIL')}
              className="px-3 py-1.5 rounded-lg bg-red-950/60 text-red-300 border border-red-600/50 hover:bg-red-900/80 text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Load Fail Scenario (Exceeds MPE)</span>
            </button>
            <button
              onClick={() => onLoadScenario('MICROBALANCE_PASS')}
              className="px-3 py-1.5 rounded-lg bg-cyan-950/60 text-cyan-300 border border-cyan-600/50 hover:bg-cyan-900/80 text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Load Class I Microbalance</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Recent Evaluations & Metrological Accuracy Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recent Evaluations Table */}
        <div className="lg:col-span-2 glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Recent Metrological Evaluations
              </h2>
              <p className="text-xs text-slate-400">Live test data stream with OIML R-76 verdict</p>
            </div>
            <button 
              onClick={() => onNavigateTab('reports')} 
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <span>View All Reports</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Test ID</th>
                  <th className="py-2.5 px-3">Instrument</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Result</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {tests.slice(0, 5).map(test => {
                  const inst = instruments.find(i => i.id === test.instrumentId);
                  const isPass = test.overallResult === 'PASS';
                  return (
                    <tr key={test.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-semibold text-cyan-400">
                        {test.id}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">{inst?.model || 'NAWI Scale'}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{inst?.serialNumber}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="badge badge-purple text-[10px]">
                          {inst?.instrumentClass?.replace('_', ' ') || 'Class III'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {test.testDate || '2026-09-09'}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`badge ${isPass ? 'badge-pass' : 'badge-fail'}`}>
                          {isPass ? '✓ PASS' : '✗ FAIL'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right space-x-1">
                        <button
                          onClick={() => onViewTest(test)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium transition-colors"
                        >
                          Inspect Math
                        </button>
                        <button
                          onClick={() => onViewReport(test.reportId)}
                          className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 rounded text-[11px] font-medium transition-colors"
                        >
                          Certificate
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: OIML Accuracy Classes & Quick Metrology Stats */}
        <div className="space-y-6">
          
          {/* Accuracy Classes Distribution */}
          <div className="glass-panel p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-400" />
              OIML Accuracy Classes
            </h3>

            <div className="space-y-3 text-xs">
              {[
                { name: 'Class I (Special)', count: instruments.filter(i => i.instrumentClass === 'CLASS_I').length, color: 'bg-indigo-500', mpe: '±0.5e to ±1.5e (n ≥ 50,000)' },
                { name: 'Class II (High)', count: instruments.filter(i => i.instrumentClass === 'CLASS_II').length, color: 'bg-sky-500', mpe: '±0.5e to ±1.5e (n ≤ 100,000)' },
                { name: 'Class III (Medium)', count: instruments.filter(i => i.instrumentClass === 'CLASS_III').length, color: 'bg-cyan-500', mpe: '±0.5e to ±1.5e (n ≤ 10,000)' },
                { name: 'Class IV (Ordinary)', count: instruments.filter(i => i.instrumentClass === 'CLASS_IV').length, color: 'bg-teal-500', mpe: '±0.5e to ±1.5e (n ≤ 1,000)' },
              ].map(cls => (
                <div key={cls.name} className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                  <div className="flex justify-between font-medium text-slate-200 mb-1">
                    <span>{cls.name}</span>
                    <span className="font-mono text-cyan-400 font-bold">{cls.count} Registered</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mb-1.5">{cls.mpe}</div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className={`${cls.color} h-full rounded-full`} style={{ width: `${Math.min((cls.count / 4) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Ledger Quick Ticker */}
          <div className="glass-panel p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Live Audit Ticker
              </h3>
              <button 
                onClick={() => onNavigateTab('audit')} 
                className="text-[11px] text-cyan-400 hover:underline"
              >
                View Full Log
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {auditLogs.slice(0, 3).map(log => (
                <div key={log.id} className="p-2 bg-slate-900/60 rounded border border-slate-800 text-[11px]">
                  <div className="flex items-center justify-between text-slate-400 mb-0.5">
                    <span className="font-semibold text-cyan-400">{log.action}</span>
                    <span className="font-mono text-[10px]">{log.timestamp?.split('T')[1]?.substring(0, 5) || '10:30'}</span>
                  </div>
                  <p className="text-slate-300 line-clamp-1">{log.details}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
