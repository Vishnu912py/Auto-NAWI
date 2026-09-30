import React, { useState } from 'react';
import { 
  Scale, 
  Settings, 
  CheckCircle2, 
  Plus, 
  Info, 
  FileText,
  ShieldCheck,
  Zap,
  Sliders
} from 'lucide-react';
import { ACCURACY_CLASSES, RULE_VERSIONS } from '../../core/ruleEngine';
import { logAuditAction } from '../../core/mockStore';

export default function RuleEngineConfig({ store, currentUser }) {
  const { ruleVersions = [] } = store;
  const [selectedRuleId, setSelectedRuleId] = useState(ruleVersions[0]?.id || 'OIML-R76-2006');
  const [selectedClassId, setSelectedClassId] = useState('CLASS_III');
  const [inServiceMultiplier, setInServiceMultiplier] = useState(2.0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const activeRule = ruleVersions.find(r => r.id === selectedRuleId) || ruleVersions[0];
  const activeClass = ACCURACY_CLASSES[selectedClassId] || ACCURACY_CLASSES.CLASS_III;

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    logAuditAction(store, {
      action: 'RULE_ENGINE_CONFIG_UPDATED',
      category: 'RULE_ENGINE',
      details: `Updated active rule configuration for ${activeRule.name} (In-Service Multiplier: ${inServiceMultiplier}x)`,
      user: currentUser
    });
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-cyan">Configurable Rule Engine</span>
            <span className="text-xs text-slate-400 font-mono">Modular Metrology Core</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            OIML R-76 & Statutory Rule Configurations
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Maintain regulatory independence. When statutory thresholds or OIML recommendations evolve, rules update deterministically without re-architecting application code.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Rule Versions List */}
        <div className="glass-panel p-5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            Statutory Metrology Standards
          </h2>

          <div className="space-y-2">
            {ruleVersions.map(rule => (
              <div 
                key={rule.id}
                onClick={() => setSelectedRuleId(rule.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedRuleId === rule.id
                    ? 'bg-cyan-500/15 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white">{rule.name}</span>
                  {rule.active && (
                    <span className="badge badge-pass text-[9px]">ACTIVE</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 leading-relaxed mb-2">{rule.description}</div>
                <div className="text-[10px] text-cyan-400 font-mono">Standard Body: {rule.standardBody}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Center & Right 2 Cols: Accuracy Classes & Step Function Curves */}
        <div className="lg:col-span-2 glass-panel p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Accuracy Class Tolerance Intervals & MPE Envelopes
              </h2>
              <p className="text-xs text-slate-400">Clause 3.5.1 Maximum Permissible Errors on initial verification</p>
            </div>

            <div className="flex items-center gap-1.5">
              {Object.keys(ACCURACY_CLASSES).map(clsKey => (
                <button
                  key={clsKey}
                  onClick={() => setSelectedClassId(clsKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedClassId === clsKey
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {ACCURACY_CLASSES[clsKey].symbol}
                </button>
              ))}
            </div>
          </div>

          {/* Active Class Technical Specifications */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-white">{activeClass.name}</span>
              <span className="text-xs text-cyan-400 font-mono">Min Scale Interval (e): {activeClass.minE} g</span>
            </div>
            <p className="text-xs text-slate-400">{activeClass.description}</p>
            
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                <div className="text-slate-500 text-[10px] uppercase">Min Scale Intervals (n)</div>
                <div className="font-bold text-white text-sm">{activeClass.minN?.toLocaleString()}</div>
              </div>
              <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                <div className="text-slate-500 text-[10px] uppercase">Max Scale Intervals (n)</div>
                <div className="font-bold text-white text-sm">{activeClass.maxN === Infinity ? 'Unlimited' : activeClass.maxN?.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Step Function MPE Table */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Step-Function MPE Envelopes for {activeClass.symbol} (in multiples of 'e'):
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                    <th className="py-2 px-3">Applied Load Interval (m)</th>
                    <th className="py-2 px-3">Initial Verification (mpe)</th>
                    <th className="py-2 px-3">In-Service Inspection (2x)</th>
                    <th className="py-2 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {activeClass.mpeSteps.map((step, idx) => {
                    const prevStep = idx > 0 ? activeClass.mpeSteps[idx - 1].upToE : 0;
                    const rangeText = step.upToE === Infinity 
                      ? `m > ${prevStep.toLocaleString()} e` 
                      : `${prevStep.toLocaleString()} e < m ≤ ${step.upToE.toLocaleString()} e`;

                    return (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 text-slate-200 font-semibold">{rangeText}</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">±{step.mpe} e</td>
                        <td className="py-2.5 px-3 text-amber-400">±{(step.mpe * inServiceMultiplier)} e</td>
                        <td className="py-2.5 px-3 text-right font-sans">
                          <span className="badge badge-pass text-[9px]">Enforced</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Configuration Form */}
          <form onSubmit={handleSaveConfig} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="text-xs font-bold text-white block">In-Service Inspection MPE Multiplier</label>
                <p className="text-[11px] text-slate-400">Statutory allowance for field verification vs initial type testing</p>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  step="0.1" 
                  min="1.0" 
                  max="3.0"
                  className="w-20 form-input font-mono text-center text-xs"
                  value={inServiceMultiplier}
                  onChange={(e) => setInServiceMultiplier(parseFloat(e.target.value) || 2.0)}
                />
                <span className="text-xs text-slate-400">x</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              {savedSuccess ? (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Parameters saved & logged to audit trail!
                </span>
              ) : (
                <span className="text-xs text-slate-500">Requires Metrology Officer Privileges</span>
              )}

              <button type="submit" className="btn-primary text-xs">
                Save & Apply Rule Calibration
              </button>
            </div>
          </form>

        </div>

      </div>

    </div>
  );
}
