import React from 'react';
import { ChevronRight, CheckCircle2, FileText, ArrowRight, Edit3, Eye, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CalculationResults({ onEditObservations, onGenerateReport, onViewRuleDetails }) {
  const points = [
    { load: 0, indicated: '0.000', error: '0.000', mpe: '0.2', result: 'PASS' },
    { load: 20, indicated: '20.002', error: '0.002', mpe: '0.2', result: 'PASS' },
    { load: 100, indicated: '100.004', error: '0.004', mpe: '0.2', result: 'PASS' },
    { load: 500, indicated: '500.006', error: '0.006', mpe: '0.4', result: 'PASS' },
    { load: 1000, indicated: '1000.008', error: '0.008', mpe: '0.6', result: 'PASS' },
  ];

  return (
    <div className="space-y-4">
      
      {/* Breadcrumb */}
      <div className="breadcrumb-text">
        <span className="text-blue-600">Test Management</span>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-blue-600">TR-2025-011</span>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="active">Calculation Results</span>
      </div>

      {/* Main Card */}
      <div className="ui-card p-6 space-y-6">
        
        {/* Title */}
        <h1 className="text-base font-bold text-slate-900">
          Calculation & Compliance Results
        </h1>

        {/* Top 2 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Left: Test Summary */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
            <h2 className="font-bold text-slate-900">Test Summary</h2>
            <div className="space-y-1 text-slate-600">
              <div className="flex justify-between">
                <span>Instrument:</span>
                <strong className="text-slate-900">ABC-1000 (SN1234567)</strong>
              </div>
              <div className="flex justify-between">
                <span>Test Type:</span>
                <strong className="text-slate-900">Accuracy Test (Increasing Load)</strong>
              </div>
              <div className="flex justify-between">
                <span>Accuracy Class:</span>
                <strong className="text-slate-900">III</strong>
              </div>
              <div className="flex justify-between">
                <span>Max / Min:</span>
                <strong className="text-slate-900">1000 kg / 20 kg</strong>
              </div>
              <div className="flex justify-between">
                <span>e:</span>
                <strong className="text-slate-900">0.2 kg</strong>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                <span>Rule Set:</span>
                <div className="flex items-center gap-2">
                  <strong className="text-slate-900">OIML R-76-1 (2011)</strong>
                  <button onClick={onViewRuleDetails} className="text-blue-600 hover:underline text-[11px]">
                    View Rule Details
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Overall Result Pass Badge */}
          <div className="p-6 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Overall Result
              </div>
              <div className="text-2xl font-black text-emerald-700 tracking-tight">
                PASS
              </div>
              <p className="text-xs text-emerald-900 mt-1">
                The instrument complies with the applicable requirements of OIML R-76-1.
              </p>
            </div>
          </div>

        </div>

        {/* Detailed Results Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="data-table">
            <thead>
              <tr>
                <th>Test Load (kg)</th>
                <th>Indicated Value (kg)</th>
                <th>Error (kg)</th>
                <th>Permissible Error (±kg)</th>
                <th className="text-center">Result</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p, i) => (
                <tr key={i}>
                  <td className="font-semibold text-slate-800">{p.load}</td>
                  <td>{p.indicated}</td>
                  <td className="font-mono">{p.error}</td>
                  <td className="font-mono text-slate-600">{p.mpe}</td>
                  <td className="text-center">
                    <span className="status-badge status-badge-pass">
                      {p.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Compliance Footer Note */}
        <div className="text-xs text-emerald-800 bg-emerald-50/60 p-3 rounded-md border border-emerald-100 flex items-center gap-2">
          <span className="font-bold">✦</span>
          <span>All test points are within permissible error limits as per OIML R-76-1 (2011), Accuracy Class III.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button type="button" onClick={onEditObservations} className="btn-secondary text-xs w-full sm:w-auto">
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Observations</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button type="button" onClick={onViewRuleDetails} className="btn-secondary text-xs">
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>View Calculation Details</span>
            </button>
            <button 
              type="button" 
              onClick={() => {
                confetti({ particleCount: 50, spread: 60 });
                onGenerateReport();
              }} 
              className="btn-primary text-xs font-semibold"
            >
              <span>Generate Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
