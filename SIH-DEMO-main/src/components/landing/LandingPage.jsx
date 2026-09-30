import React, { useState } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  Cpu, 
  FileCheck2, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Lock, 
  Zap, 
  Award, 
  Activity, 
  Play, 
  Sliders, 
  Presentation, 
  Building2, 
  TrendingUp, 
  Check, 
  X,
  ExternalLink
} from 'lucide-react';
import { getMPE, evaluateObservation, ACCURACY_CLASSES } from '../../core/ruleEngine';
import ToleranceChart from '../tests/ToleranceChart';

export default function LandingPage({ 
  onEnterApp, 
  onStartNewTest, 
  onOpenPitchMode, 
  onLoadScenario 
}) {
  // Interactive Sandbox Widget State
  const [sandboxClass, setSandboxClass] = useState('CLASS_III');
  const [sandboxLoad, setSandboxLoad] = useState(15.0);
  const [sandboxIndication, setSandboxIndication] = useState(15.004);
  const [sandboxE, setSandboxE] = useState(0.01);

  const sandboxEval = evaluateObservation({
    appliedLoad: sandboxLoad,
    referenceValue: sandboxLoad,
    indicatedValue: sandboxIndication,
    scaleIntervalE: sandboxE,
    instrumentClass: sandboxClass,
    isInService: false
  });

  return (
    <div className="space-y-24 py-6">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-6 pb-12">
        
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/20 via-sky-500/15 to-indigo-500/10 blur-[120px] pointer-events-none rounded-full" />
        
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 shadow-lg shadow-cyan-500/10 text-xs text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-semibold">Smart India Hackathon 2026</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-mono">PS 26035: Test Report Generation for NAWI as per OIML R-76</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            The Modern Digital Standard for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
              Weighing Instrument Certification
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
            SmartNAWI replaces manual spreadsheets, human calculation errors, and paper records with a <strong className="text-white font-semibold">deterministic OIML R-76 rule engine</strong>, instant tolerance validation, and tamper-evident digital certificate generation for Legal Metrology laboratories.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onEnterApp('tests')}
              className="btn-primary text-sm px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-sky-500 hover:brightness-110 shadow-xl shadow-cyan-500/25 flex items-center gap-2 font-bold"
            >
              <Cpu className="w-5 h-5" />
              <span>Launch Type-Evaluation Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenPitchMode}
              className="px-5 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/40 text-sm font-semibold flex items-center gap-2 transition-all shadow-md"
            >
              <Presentation className="w-4 h-4 text-amber-400" />
              <span>Pitch Deck Mode (Slide Tour)</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </button>

            <button
              onClick={() => onEnterApp('verification')}
              className="btn-secondary text-sm px-5 py-3.5 rounded-xl flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Public QR Verifier</span>
            </button>
          </div>

          {/* Quick Metrology Trust Pills */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
            {[
              { title: 'Zero Arithmetic Errors', desc: 'Deterministic MPE Rule Engine', icon: CheckCircle2, color: 'text-emerald-400' },
              { title: 'OIML R-76-1:2006', desc: 'Class I, II, III & IV Specifications', icon: Scale, color: 'text-cyan-400' },
              { title: 'Tamper Evident', desc: 'Cryptographic SHA-256 Signatures', icon: Lock, color: 'text-purple-400' },
              { title: '10x Faster Issuance', desc: 'From Days Down to Minutes', icon: Zap, color: 'text-amber-400' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-3.5 bg-slate-900/70 rounded-xl border border-slate-800/80 flex items-start gap-3">
                  <Icon className={`w-5 h-5 ${item.color} shrink-0 mt-0.5`} />
                  <div>
                    <div className="text-xs font-bold text-white">{item.title}</div>
                    <div className="text-[11px] text-slate-400 leading-tight">{item.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </section>

      {/* 2. INTERACTIVE LIVE METROLOGY SANDBOX (Judge Interactive Wow Moment) */}
      <section className="max-w-5xl mx-auto">
        <div className="glass-panel p-6 sm:p-8 bg-gradient-to-b from-slate-900 to-slate-950 border-cyan-500/40 relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge badge-cyan">Interactive Lab Widget</span>
                <span className="text-xs text-slate-400 font-mono">Live Rule Engine Simulator</span>
              </div>
              <h2 className="text-2xl font-black text-white">
                Live OIML R-76 MPE Tolerance Simulator
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Slide the applied load and scale indication to see the deterministic step-function calculate permissible error in real-time.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Try Scenario:</span>
              <button
                onClick={() => {
                  setSandboxClass('CLASS_III');
                  setSandboxLoad(20.0);
                  setSandboxIndication(20.003);
                  setSandboxE(0.01);
                }}
                className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 text-xs font-medium hover:bg-emerald-900"
              >
                Safe Pass
              </button>
              <button
                onClick={() => {
                  setSandboxClass('CLASS_III');
                  setSandboxLoad(20.0);
                  setSandboxIndication(20.019); // Exceeds MPE of 0.015!
                  setSandboxE(0.01);
                }}
                className="px-2.5 py-1 rounded bg-red-950 text-red-300 border border-red-700 text-xs font-medium hover:bg-red-900"
              >
                Exceed MPE (Fail)
              </button>
            </div>
          </div>

          {/* Sandbox Control Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Controls (5 cols) */}
            <div className="lg:col-span-5 space-y-4 text-xs">
              
              {/* Accuracy Class Selector */}
              <div>
                <label className="form-label">Instrument Accuracy Class</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['CLASS_I', 'CLASS_II', 'CLASS_III', 'CLASS_IV'].map(cls => (
                    <button
                      key={cls}
                      onClick={() => setSandboxClass(cls)}
                      className={`py-2 rounded-lg font-bold text-center transition-all ${
                        sandboxClass === cls
                          ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {ACCURACY_CLASSES[cls].symbol}
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-cyan-400 mt-1">
                  {ACCURACY_CLASSES[sandboxClass].name} — {ACCURACY_CLASSES[sandboxClass].description}
                </div>
              </div>

              {/* Applied Load Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-300">Applied Test Load (L):</span>
                  <span className="font-mono font-bold text-white text-sm">{sandboxLoad} kg</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="30.0"
                  step="0.1"
                  value={sandboxLoad}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setSandboxLoad(val);
                    if (Math.abs(sandboxIndication - sandboxLoad) > 0.05) {
                      setSandboxIndication(val);
                    }
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Observed Scale Indication Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-300">Observed Scale Indication (I):</span>
                  <span className="font-mono font-bold text-cyan-300 text-sm">{sandboxIndication} kg</span>
                </div>
                <input
                  type="range"
                  min={Number((sandboxLoad - 0.03).toFixed(3))}
                  max={Number((sandboxLoad + 0.03).toFixed(3))}
                  step="0.001"
                  value={sandboxIndication}
                  onChange={(e) => setSandboxIndication(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Verification Scale Interval (e) */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Scale Interval (e):</span>
                  <span className="font-mono font-bold text-white">{sandboxE} kg (10 g)</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Load in multiples of e (m):</span>
                  <span className="font-mono text-cyan-400">{sandboxEval.loadInE?.toLocaleString()} e</span>
                </div>
              </div>

            </div>

            {/* Right Verdict & Tolerance Gauge (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
              
              {/* Verdict Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Deterministic Evaluation Outcome
                </span>
                <span className={`badge ${sandboxEval.passed ? 'badge-pass' : 'badge-fail'} text-xs px-3 py-1`}>
                  {sandboxEval.passed ? '✓ OIML COMPLIANT' : '✗ NON-COMPLIANT'}
                </span>
              </div>

              {/* Error Comparison Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Observed Error (E)</div>
                  <div className={`text-base font-extrabold ${sandboxEval.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                    {sandboxEval.correctedError >= 0 ? '+' : ''}{sandboxEval.correctedError} kg
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Permissible (MPE)</div>
                  <div className="text-base font-extrabold text-amber-400">
                    ±{sandboxEval.mpeLimit} kg
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-slate-500 uppercase">MPE in 'e' Units</div>
                  <div className="text-base font-extrabold text-cyan-300">
                    ±{sandboxEval.mpeInE} e
                  </div>
                </div>
              </div>

              {/* Tolerance Utilization Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Tolerance Margin Utilization:</span>
                  <span className={`font-bold ${sandboxEval.marginPercent <= 100 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {sandboxEval.marginPercent}% of allowable limit
                  </span>
                </div>
                <div className="gauge-bar h-3">
                  <div
                    className={`gauge-fill ${
                      sandboxEval.marginPercent <= 70 ? 'bg-cyan-400' : sandboxEval.marginPercent <= 100 ? 'bg-amber-400' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(sandboxEval.marginPercent, 100)}%` }}
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
                <span>Rule: <strong>OIML R-76-1:2006 (Clause 3.5.1)</strong></span>
                <button
                  onClick={() => onEnterApp('tests')}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                >
                  <span>Test Full Instrument Curve</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 3. THE 6-STEP AUTOMATED WORKFLOW INFOGRAPHIC */}
      <section className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="badge badge-cyan">End-to-End Pipeline</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            How SmartNAWI Works in 6 Automated Steps
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            From raw laboratory measurements to an internationally recognized, cryptographically signed test certificate.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              step: '01',
              title: 'Role-Based Authentication',
              desc: 'Technicians, Reviewers, Admins, and Public Inspectors log in with role-segregated cryptographic permissions.',
              icon: Lock,
              color: 'from-cyan-500 to-blue-500'
            },
            {
              step: '02',
              title: 'Instrument & Environment Data',
              desc: 'Capture Max, Min, scale interval e, accuracy class, ambient temp, humidity, and standard weight traceability.',
              icon: Layers,
              color: 'from-teal-500 to-emerald-500'
            },
            {
              step: '03',
              title: 'Observation Entry & Validation',
              desc: 'Enter increasing/decreasing load steps, repeatability runs, and off-center platter corner tests with real-time range checks.',
              icon: Sliders,
              color: 'from-sky-500 to-indigo-500'
            },
            {
              step: '04',
              title: 'Deterministic OIML Rule Engine',
              desc: 'Applies OIML R-76-1:2006 formulas, computes step-function MPE thresholds, and evaluates corrected errors Ec = E - E0.',
              icon: Cpu,
              color: 'from-amber-500 to-orange-500'
            },
            {
              step: '05',
              title: 'Automated PASS / FAIL Decision',
              desc: 'Deterministic evaluation based purely on statutory mathematical rules without subjective human judgment.',
              icon: Award,
              color: 'from-emerald-500 to-teal-500'
            },
            {
              step: '06',
              title: 'PDF Certificate & SHA-256 Stamp',
              desc: 'Generates standardized OIML R-76-2 test certificate with embedded QR code, digital signature, and tamper ledger entry.',
              icon: FileCheck2,
              color: 'from-purple-500 to-pink-500'
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-panel p-5 relative overflow-hidden group hover:border-cyan-500/50 transition-all">
                <div className="text-4xl font-black text-slate-800 absolute right-3 top-3 font-mono group-hover:text-slate-700/60 transition-colors">
                  {item.step}
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.color} p-0.5 mb-3 shadow-md`}>
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. COMPARISON: STATUS QUO VS SMARTNAWI */}
      <section className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="badge badge-purple">Technological Leap</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Manual Testing vs. SmartNAWI Platform
          </h2>
        </div>

        <div className="glass-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4">Evaluation Dimension</th>
                  <th className="py-3 px-4 text-red-400">Traditional Manual Process</th>
                  <th className="py-3 px-4 text-emerald-400">SmartNAWI Digital Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-sans">
                {[
                  {
                    dim: 'MPE Error Calculations',
                    manual: 'Manual calculator arithmetic / spreadsheets prone to typos',
                    smart: '100% deterministic OIML R-76 rule engine with zero math errors',
                  },
                  {
                    dim: 'Turnaround Time',
                    manual: '2 to 5 business days per type-evaluation certificate',
                    smart: 'Under 10 minutes from test completion to signed PDF',
                  },
                  {
                    dim: 'Format Standardization',
                    manual: 'Inconsistent Word documents across regional laboratories',
                    smart: 'Nationally standardized OIML R-76-2 report template',
                  },
                  {
                    dim: 'Tamper Protection',
                    manual: 'Paper / static PDF susceptible to unauthorized post-issuance edits',
                    smart: 'Cryptographic SHA-256 hash ledger + instant public QR verifier',
                  },
                  {
                    dim: 'Regulatory Agility',
                    manual: 'Hardcoded spreadsheets require complete re-authoring when laws change',
                    smart: 'Modular rule engine allows updating thresholds without touching code',
                  },
                  {
                    dim: 'Audit Traceability',
                    manual: 'Physical logbooks with fragmented accountability',
                    smart: 'Immutable digital audit trail tracking every user action & timestamp',
                  }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-bold text-white">{row.dim}</td>
                    <td className="py-3 px-4 text-slate-400 flex items-start gap-2">
                      <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>{row.manual}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-200">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="font-semibold text-white">{row.smart}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. 4-DIMENSIONAL NATIONAL IMPACT */}
      <section className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="badge badge-amber">Holistic Value</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            4-Dimensional National Impact Matrix
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            SmartNAWI creates sustainable value across laboratories, manufacturers, traders, and citizens.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: '🛡️ Social Impact: Unforgeable Public Trust',
              desc: 'Consumers and traders gain complete confidence that weighing scales in marketplaces have been validated against authentic statutory metrological rules.',
              highlight: 'Cryptographic QR codes empower anyone to verify certificates instantly on mobile.'
            },
            {
              title: '💰 Economic Impact: Faster Market Access',
              desc: 'Weighing instrument manufacturers experience drastically shorter certification lead times, eliminating costly re-testing caused by manual calculation blunders.',
              highlight: 'Saves thousands of laboratory technician man-hours annually across India.'
            },
            {
              title: '🌱 Environmental Impact: 100% Paperless',
              desc: 'Eliminates paper test forms, physical binders, and mail-based certificate dispatch in favor of cloud-accessible digital repositories.',
              highlight: 'Zero paper waste across national and regional reference testing centers.'
            },
            {
              title: '🏛️ Governance Impact: National Standardization',
              desc: 'Enables unified OIML R-76 reporting compliance across the Department of Consumer Affairs (DoCA), RRSLs, and state Legal Metrology Directorates.',
              highlight: 'Single source of truth for national metrological type-approval certificates.'
            },
          ].map((card, idx) => (
            <div key={idx} className="glass-panel p-6 space-y-3">
              <h3 className="text-base font-bold text-white">{card.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{card.desc}</p>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-cyan-300 font-mono">
                ✦ {card.highlight}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BOTTOM CTA BANNER */}
      <section className="max-w-5xl mx-auto text-center">
        <div className="glass-panel p-10 bg-gradient-to-tr from-slate-900 via-cyan-950/30 to-slate-900 border-cyan-500/40 relative overflow-hidden space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
            <Scale className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Ready to Explore the Live SmartNAWI Platform?
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">
            Step directly into the laboratory test evaluation studio or launch the interactive SIH pitch walkthrough.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => onEnterApp('dashboard')}
              className="btn-primary text-sm px-6 py-3"
            >
              <Activity className="w-4 h-4" />
              <span>Enter Laboratory Workspace</span>
            </button>
            <button
              onClick={onOpenPitchMode}
              className="btn-secondary text-sm px-6 py-3 border-amber-500/40 text-amber-300"
            >
              <Presentation className="w-4 h-4 text-amber-400" />
              <span>Open Presentation Pitch Deck</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
