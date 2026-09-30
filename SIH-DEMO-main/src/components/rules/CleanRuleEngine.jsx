import React, { useState } from 'react';
import { Sliders, Scale, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function CleanRuleEngine() {
  const [activeRule, setActiveRule] = useState('OIML-R76-2011');

  return (
    <div className="space-y-4">
      <div className="breadcrumb-text">
        <span className="active">Rule Engine</span>
      </div>

      <div className="ui-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-base font-bold text-slate-900">
              OIML R-76 Rule Engine Configuration
            </h1>
            <p className="text-xs text-slate-500">
              Statutory Maximum Permissible Error (MPE) thresholds & Accuracy Class step functions.
            </p>
          </div>
          <span className="status-badge status-badge-pass text-xs">
            Engine Online
          </span>
        </div>

        {/* Rule Sets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'OIML-R76-2011', name: 'OIML R-76-1 (2011 / 2006)', org: 'International Legal Metrology', status: 'Active Default' },
            { id: 'LM-INDIA-2011', name: 'Legal Metrology Rules 2011', org: 'Dept. of Consumer Affairs, India', status: 'Active' },
            { id: 'IS-9281', name: 'BIS IS 9281:2019', org: 'Bureau of Indian Standards', status: 'Optional' },
          ].map(r => (
            <div 
              key={r.id}
              onClick={() => setActiveRule(r.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                activeRule === r.id ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs text-slate-900">{r.name}</span>
                <span className="status-badge status-badge-pass text-[9px]">{r.status}</span>
              </div>
              <div className="text-[11px] text-slate-500">{r.org}</div>
            </div>
          ))}
        </div>

        {/* Step function table for Class III */}
        <div className="space-y-2 pt-2">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Accuracy Class III (Medium Accuracy) MPE Step Function
          </h2>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Load Range (m in multiples of e)</th>
                  <th>Initial Type Evaluation (MPE)</th>
                  <th>In-Service Verification (2x MPE)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-mono text-slate-800 font-semibold">0 ≤ m ≤ 500 e</td>
                  <td className="font-mono text-emerald-700 font-bold">± 0.5 e (± 0.1 kg)</td>
                  <td className="font-mono text-amber-700">± 1.0 e (± 0.2 kg)</td>
                  <td><span className="status-badge status-badge-pass">Enforced</span></td>
                </tr>
                <tr>
                  <td className="font-mono text-slate-800 font-semibold">500 e &lt; m ≤ 2000 e</td>
                  <td className="font-mono text-emerald-700 font-bold">± 1.0 e (± 0.2 kg)</td>
                  <td className="font-mono text-amber-700">± 2.0 e (± 0.4 kg)</td>
                  <td><span className="status-badge status-badge-pass">Enforced</span></td>
                </tr>
                <tr>
                  <td className="font-mono text-slate-800 font-semibold">2000 e &lt; m ≤ 10000 e</td>
                  <td className="font-mono text-emerald-700 font-bold">± 1.5 e (± 0.3 kg)</td>
                  <td className="font-mono text-amber-700">± 3.0 e (± 0.6 kg)</td>
                  <td><span className="status-badge status-badge-pass">Enforced</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
