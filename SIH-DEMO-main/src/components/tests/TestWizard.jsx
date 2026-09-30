import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Cpu, 
  ArrowRight, 
  ArrowLeft, 
  Play, 
  FileCheck2, 
  Sparkles, 
  Plus, 
  Trash2, 
  Thermometer, 
  Droplets, 
  Layers, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  evaluatePerformanceTest, 
  evaluateRepeatabilityTest, 
  evaluateEccentricityTest, 
  getMPE, 
  ACCURACY_CLASSES 
} from '../../core/ruleEngine';
import { calculateSHA256, generateDigitalSignature } from '../../core/cryptoUtils';
import { logAuditAction } from '../../core/mockStore';
import ToleranceChart from './ToleranceChart';

export default function TestWizard({ 
  store, 
  currentUser, 
  onTestCreated, 
  onCancel,
  preloadedScenario = null
}) {
  const { instruments = [], labs = [], ruleVersions = [] } = store;

  const [step, setStep] = useState(1); // 1: Setup, 2: Performance Observations, 3: Repeatability & Corner, 4: Rule Analysis
  const [selectedInstId, setSelectedInstId] = useState(instruments[0]?.id || '');
  const [ruleVersion, setRuleVersion] = useState('OIML-R76-2006');
  
  // Environmental Record
  const [environmental, setEnvironmental] = useState({
    temperature: 23.5,
    humidity: 54.0,
    pressure: 1013.25,
    weightsSetNo: 'F1-NABL-2025-998'
  });

  // Observations Table
  const [observations, setObservations] = useState([
    { id: '1', appliedLoad: 0, referenceValue: 0, indicatedValue: 0.000, deltaL: 0, direction: 'INC' },
    { id: '2', appliedLoad: 0.2, referenceValue: 0.2, indicatedValue: 0.200, deltaL: 0, direction: 'INC' },
    { id: '3', appliedLoad: 5.0, referenceValue: 5.0, indicatedValue: 5.002, deltaL: 0, direction: 'INC' },
    { id: '4', appliedLoad: 10.0, referenceValue: 10.0, indicatedValue: 10.003, deltaL: 0, direction: 'INC' },
    { id: '5', appliedLoad: 20.0, referenceValue: 20.0, indicatedValue: 20.004, deltaL: 0, direction: 'INC' },
    { id: '6', appliedLoad: 30.0, referenceValue: 30.0, indicatedValue: 30.005, deltaL: 0, direction: 'INC' },
    { id: '7', appliedLoad: 10.0, referenceValue: 10.0, indicatedValue: 10.002, deltaL: 0, direction: 'DEC' },
    { id: '8', appliedLoad: 0, referenceValue: 0, indicatedValue: 0.000, deltaL: 0, direction: 'DEC' }
  ]);

  // Repeatability Test Runs
  const [repeatability, setRepeatability] = useState([
    { appliedLoad: 15.0, indicatedValue: 15.002 },
    { appliedLoad: 15.0, indicatedValue: 15.003 },
    { appliedLoad: 15.0, indicatedValue: 15.002 }
  ]);

  // Eccentricity Corner Test
  const [eccentricity, setEccentricity] = useState([
    { positionName: '1 - Center', appliedLoad: 10.0, indicatedValue: 10.001 },
    { positionName: '2 - Front Left', appliedLoad: 10.0, indicatedValue: 10.002 },
    { positionName: '3 - Front Right', appliedLoad: 10.0, indicatedValue: 10.003 },
    { positionName: '4 - Rear Right', appliedLoad: 10.0, indicatedValue: 10.002 },
    { positionName: '5 - Rear Left', appliedLoad: 10.0, indicatedValue: 10.001 }
  ]);

  // Evaluation Results
  const [evaluating, setEvaluating] = useState(false);
  const [perfResult, setPerfResult] = useState(null);
  const [repResult, setRepResult] = useState(null);
  const [eccResult, setEccResult] = useState(null);
  const [overallPassed, setOverallPassed] = useState(null);

  const activeInstrument = instruments.find(i => i.id === selectedInstId) || instruments[0];
  const unit = activeInstrument?.unit || 'kg';

  // Handle preloaded scenario if passed
  useEffect(() => {
    if (preloadedScenario) {
      if (preloadedScenario.instrumentId) setSelectedInstId(preloadedScenario.instrumentId);
      if (preloadedScenario.environmental) setEnvironmental(preloadedScenario.environmental);
      if (preloadedScenario.observations) {
        setObservations(preloadedScenario.observations.map((o, i) => ({ ...o, id: `pt-${i+1}` })));
      }
      if (preloadedScenario.repeatability) setRepeatability(preloadedScenario.repeatability);
      if (preloadedScenario.eccentricity) setEccentricity(preloadedScenario.eccentricity);
      setStep(2); // Jump to observations
    }
  }, [preloadedScenario]);

  // Add observation row
  const handleAddRow = () => {
    const lastLoad = observations[observations.length - 1]?.appliedLoad || 0;
    const newLoad = Number((lastLoad + (activeInstrument.capacity / 5)).toFixed(3));
    setObservations([
      ...observations,
      {
        id: `pt-${Date.now()}`,
        appliedLoad: newLoad,
        referenceValue: newLoad,
        indicatedValue: newLoad,
        deltaL: 0,
        direction: 'INC'
      }
    ]);
  };

  // Remove row
  const handleRemoveRow = (id) => {
    if (observations.length <= 2) return;
    setObservations(observations.filter(o => o.id !== id));
  };

  // Update row
  const handleUpdateRow = (id, field, value) => {
    setObservations(observations.map(o => {
      if (o.id === id) {
        const updated = { ...o, [field]: value };
        if (field === 'appliedLoad' && (!o.referenceValue || o.referenceValue === o.appliedLoad)) {
          updated.referenceValue = value;
        }
        return updated;
      }
      return o;
    }));
  };

  // Run OIML R-76 Deterministic Rule Engine
  const handleRunEvaluation = () => {
    setEvaluating(true);
    setStep(4);

    setTimeout(() => {
      const pRes = evaluatePerformanceTest(observations, activeInstrument);
      const rRes = evaluateRepeatabilityTest(repeatability, activeInstrument);
      const eRes = evaluateEccentricityTest(eccentricity, activeInstrument);

      const pass = pRes.passed && rRes.passed && eRes.passed;

      setPerfResult(pRes);
      setRepResult(rRes);
      setEccResult(eRes);
      setOverallPassed(pass);
      setEvaluating(false);

      if (pass) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }, 600);
  };

  // Finalize & Issue Test Certificate
  const handleGenerateReport = async () => {
    const testId = `TEST-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const reportId = `RPT-2026-DOCA-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toISOString();

    const testPayload = {
      id: testId,
      reportId,
      instrumentId: activeInstrument.id,
      labId: activeInstrument.labId,
      technicianId: currentUser.id,
      technicianName: currentUser.name,
      reviewerId: 'USR-REV-02',
      reviewerName: 'Ananya Iyer',
      ruleVersion,
      testDate: new Date().toISOString().split('T')[0],
      status: overallPassed ? 'APPROVED' : 'REJECTED_NON_COMPLIANT',
      overallResult: overallPassed ? 'PASS' : 'FAIL',
      environmental,
      performanceTest: perfResult,
      repeatabilityTest: repResult,
      eccentricityTest: eccResult,
      createdAt: timestamp
    };

    const hash = await calculateSHA256(testPayload);
    const signature = overallPassed ? await generateDigitalSignature({
      reportId,
      hash,
      signerName: currentUser.role === 'REVIEWER' ? currentUser.name : 'Ananya Iyer',
      signerRole: 'Certifying Officer & Reviewer',
      timestamp
    }) : null;

    const report = {
      id: reportId,
      testId,
      instrumentId: activeInstrument.id,
      labId: activeInstrument.labId,
      reportNumber: `NAWI/DOCA/2026/${Math.floor(10000 + Math.random() * 90000)}`,
      generatedAt: timestamp,
      generatedBy: currentUser.name,
      status: overallPassed ? 'ISSUED' : 'REJECTED_NON_COMPLIANT',
      result: overallPassed ? 'PASS' : 'FAIL',
      sha256Hash: hash,
      digitalSignature: signature,
      testDataSnapshot: testPayload
    };

    // Update store & log audit
    store.tests.unshift(testPayload);
    store.reports.unshift(report);
    logAuditAction(store, {
      action: 'EVALUATION_COMPLETED',
      category: 'TEST_EXECUTION',
      details: `Completed OIML R-76 test for ${activeInstrument.model} (${testId}) -> Verdict: ${overallPassed ? 'PASS' : 'FAIL'}`,
      user: currentUser
    });

    onTestCreated(report);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Step Header */}
      <div className="glass-panel p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-cyan">New Metrological Test</span>
              <span className="text-xs text-slate-400 font-mono">Workflow Step {step} of 4</span>
            </div>
            <h1 className="text-xl font-extrabold text-white mt-1">
              OIML R-76 Type-Evaluation Suite
            </h1>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            {[
              { num: 1, label: 'Instrument' },
              { num: 2, label: 'Observations' },
              { num: 3, label: 'Repeatability' },
              { num: 4, label: 'Rule Engine' }
            ].map(s => (
              <div 
                key={s.num} 
                onClick={() => s.num < step && setStep(s.num)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  step === s.num
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : step > s.num
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 cursor-pointer'
                    : 'bg-slate-800/50 text-slate-500'
                }`}
              >
                <span>{step > s.num ? '✓' : s.num}.</span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Instrument Ribbon */}
        <div className="mt-4 flex flex-wrap items-center justify-between text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center gap-3">
            <Scale className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="text-slate-400">Instrument: </span>
              <span className="font-bold text-white">{activeInstrument?.model}</span>
              <span className="text-slate-400 ml-2 font-mono">({activeInstrument?.serialNumber})</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2 sm:mt-0 font-mono">
            <span className="text-slate-400">Class: <strong className="text-cyan-300">{activeInstrument?.instrumentClass?.replace('_', ' ')}</strong></span>
            <span className="text-slate-400">Max: <strong className="text-white">{activeInstrument?.capacity} {unit}</strong></span>
            <span className="text-slate-400">e: <strong className="text-white">{activeInstrument?.scaleInterval} {unit}</strong></span>
          </div>
        </div>
      </div>

      {/* STEP 1: Instrument & Environmental Conditions */}
      {step === 1 && (
        <div className="glass-panel p-6 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Select Instrument & Laboratory Environmental Parameters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Instrument Selection */}
            <div className="space-y-4">
              <div>
                <label className="form-label">Instrument Under Test (NAWI)</label>
                <select 
                  className="form-input"
                  value={selectedInstId}
                  onChange={(e) => setSelectedInstId(e.target.value)}
                >
                  {instruments.map(inst => (
                    <option key={inst.id} value={inst.id}>
                      {inst.model} ({inst.serialNumber}) — Class {inst.instrumentClass?.replace('CLASS_', '')} — Max {inst.capacity} {inst.unit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Applicable Metrology Standard / Rule Version</label>
                <select 
                  className="form-input"
                  value={ruleVersion}
                  onChange={(e) => setRuleVersion(e.target.value)}
                >
                  {ruleVersions.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} {r.active ? '(Active Standard)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div className="font-semibold text-cyan-400">Instrument Metrological Parameters:</div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>Capacity (Max): <span className="font-mono text-white">{activeInstrument.capacity} {unit}</span></div>
                  <div>Min Capacity: <span className="font-mono text-white">{activeInstrument.minCapacity} {unit}</span></div>
                  <div>Scale Interval (e): <span className="font-mono text-white">{activeInstrument.scaleInterval} {unit}</span></div>
                  <div>Intervals (n): <span className="font-mono text-white">{activeInstrument.verificationScaleIntervals}</span></div>
                </div>
              </div>
            </div>

            {/* Environmental Conditions */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-red-400" /> Temperature (°C)
                  </label>
                  <input 
                    type="number" 
                    step="0.1" 
                    className="form-input font-mono"
                    value={environmental.temperature}
                    onChange={(e) => setEnvironmental({ ...environmental, temperature: parseFloat(e.target.value) || 0 })}
                  />
                  <span className="text-[10px] text-slate-500">OIML Range: +10°C to +30°C</span>
                </div>

                <div>
                  <label className="form-label flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-sky-400" /> Humidity (% RH)
                  </label>
                  <input 
                    type="number" 
                    step="0.5" 
                    className="form-input font-mono"
                    value={environmental.humidity}
                    onChange={(e) => setEnvironmental({ ...environmental, humidity: parseFloat(e.target.value) || 0 })}
                  />
                  <span className="text-[10px] text-slate-500">OIML Max: 85% RH</span>
                </div>
              </div>

              <div>
                <label className="form-label">Atmospheric Pressure (hPa / mbar)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  className="form-input font-mono"
                  value={environmental.pressure}
                  onChange={(e) => setEnvironmental({ ...environmental, pressure: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div>
                <label className="form-label">Standard Weights Calibration Certificate No.</label>
                <input 
                  type="text" 
                  className="form-input font-mono"
                  value={environmental.weightsSetNo}
                  onChange={(e) => setEnvironmental({ ...environmental, weightsSetNo: e.target.value })}
                />
              </div>
            </div>

          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <button onClick={onCancel} className="btn-secondary">Cancel</button>
            <button onClick={() => setStep(2)} className="btn-primary">
              <span>Next: Record Observations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Weighing Performance Observations Table */}
      {step === 2 && (
        <div className="glass-panel p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Weighing Performance Test (Clause 3.5)
              </h2>
              <p className="text-xs text-slate-400">
                Enter applied test loads and observed scale indications for increasing (↑) and decreasing (↓) cycles.
              </p>
            </div>

            <button onClick={handleAddRow} className="btn-secondary text-xs flex items-center gap-1.5 self-start">
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>Add Load Step</span>
            </button>
          </div>

          {/* Observations Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
                  <th className="py-2 px-2">#</th>
                  <th className="py-2 px-2">Direction</th>
                  <th className="py-2 px-2">Applied Load ({unit})</th>
                  <th className="py-2 px-2">Reference ({unit})</th>
                  <th className="py-2 px-2">Indicated Value ({unit})</th>
                  <th className="py-2 px-2">Observed Error</th>
                  <th className="py-2 px-2">Permissible (MPE)</th>
                  <th className="py-2 px-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {observations.map((row, index) => {
                  const L = Number(row.appliedLoad) || 0;
                  const I = Number(row.indicatedValue) || 0;
                  const rawErr = Number((I - L).toFixed(5));
                  const mpeObj = getMPE(L / (activeInstrument.scaleInterval || 1), activeInstrument.instrumentClass, false, activeInstrument.scaleInterval);
                  const isWithin = Math.abs(rawErr) <= (mpeObj.mpeInLoadUnits + 0.000001);

                  return (
                    <tr key={row.id} className="hover:bg-slate-800/40">
                      <td className="py-2 px-2 font-mono text-slate-400">{index + 1}</td>
                      <td className="py-2 px-2">
                        <select 
                          className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-200"
                          value={row.direction}
                          onChange={(e) => handleUpdateRow(row.id, 'direction', e.target.value)}
                        >
                          <option value="INC">Increasing (↑)</option>
                          <option value="DEC">Decreasing (↓)</option>
                        </select>
                      </td>
                      <td className="py-2 px-2">
                        <input 
                          type="number" 
                          step="any"
                          className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-white"
                          value={row.appliedLoad}
                          onChange={(e) => handleUpdateRow(row.id, 'appliedLoad', parseFloat(e.target.value) || 0)}
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input 
                          type="number" 
                          step="any"
                          className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-white"
                          value={row.referenceValue}
                          onChange={(e) => handleUpdateRow(row.id, 'referenceValue', parseFloat(e.target.value) || 0)}
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input 
                          type="number" 
                          step="any"
                          className="w-28 bg-slate-900 border border-cyan-500/50 rounded px-2 py-1 text-xs font-mono text-cyan-300 font-bold"
                          value={row.indicatedValue}
                          onChange={(e) => handleUpdateRow(row.id, 'indicatedValue', parseFloat(e.target.value) || 0)}
                        />
                      </td>
                      <td className="py-2 px-2 font-mono">
                        <span className={`font-semibold ${isWithin ? 'text-emerald-400' : 'text-red-400'}`}>
                          {rawErr >= 0 ? '+' : ''}{rawErr} {unit}
                        </span>
                      </td>
                      <td className="py-2 px-2 font-mono text-slate-400">
                        ±{mpeObj.mpeInLoadUnits} {unit} <span className="text-[10px] text-slate-500">(±{mpeObj.mpeInE}e)</span>
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button 
                          onClick={() => handleRemoveRow(row.id)}
                          className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                          title="Remove Point"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <button onClick={() => setStep(1)} className="btn-secondary">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button onClick={() => setStep(3)} className="btn-primary">
              <span>Next: Repeatability & Eccentricity</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Repeatability & Eccentricity Test Observations */}
      {step === 3 && (
        <div className="glass-panel p-6 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-cyan-400" />
            Repeatability & Platter Eccentricity (Corner Load) Tests
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Repeatability Test (3 runs at 50% Max) */}
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white">Repeatability (Clause 3.6.1)</span>
                <span className="text-[11px] text-cyan-400 font-mono">Load: {repeatability[0]?.appliedLoad} {unit}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                3 repeated observations at ~50% capacity. Max spread $\Delta E$ cannot exceed $|MPE|$.
              </p>

              <div className="space-y-2">
                {repeatability.map((run, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-slate-400">Run #{idx + 1}:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-mono">{run.appliedLoad} {unit} →</span>
                      <input 
                        type="number" 
                        step="any"
                        className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-cyan-300"
                        value={run.indicatedValue}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setRepeatability(repeatability.map((r, i) => i === idx ? { ...r, indicatedValue: val } : r));
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platter Eccentricity / Corner Loading */}
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white">Eccentricity (Clause 3.6.2)</span>
                <span className="text-[11px] text-cyan-400 font-mono">1/3 Max: {eccentricity[0]?.appliedLoad} {unit}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Off-center load test across 5 positions (Center + 4 quadrants).
              </p>

              <div className="space-y-1.5">
                {eccentricity.map((pos, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs bg-slate-950 p-1.5 rounded border border-slate-800">
                    <span className="text-slate-300">{pos.positionName}:</span>
                    <input 
                      type="number" 
                      step="any"
                      className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-cyan-300"
                      value={pos.indicatedValue}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setEccentricity(eccentricity.map((p, i) => i === idx ? { ...p, indicatedValue: val } : p));
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <button onClick={() => setStep(2)} className="btn-secondary">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button 
              onClick={handleRunEvaluation} 
              className="btn-primary bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold px-6 py-2.5 shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Execute OIML Rule Engine & Validate</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Rule Engine Compliance Analysis & Verdict */}
      {step === 4 && (
        <div className="glass-panel p-6 space-y-6">
          
          {evaluating ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="text-base font-bold text-white">Applying OIML R-76-1:2006 Deterministic Rules...</div>
              <div className="text-xs text-slate-400">Computing step-by-step permissible errors & compliance thresholds</div>
            </div>
          ) : (
            <>
              {/* Verdict Header Banner */}
              <div className={`p-6 rounded-2xl border ${
                overallPassed 
                  ? 'bg-emerald-950/40 border-emerald-500/50 shadow-lg shadow-emerald-500/10' 
                  : 'bg-red-950/40 border-red-500/50 shadow-lg shadow-red-500/10'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      overallPassed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {overallPassed ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Type-Evaluation Verdict
                      </span>
                      <h2 className="text-2xl font-black text-white flex items-center gap-2">
                        {overallPassed ? 'OIML R-76 COMPLIANT (PASS)' : 'NON-COMPLIANT (FAIL)'}
                      </h2>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {overallPassed 
                          ? 'All test points strictly conform to OIML R-76-1 Maximum Permissible Error (MPE) envelopes.'
                          : 'One or more observations exceed the statutory permissible error tolerance limit.'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-400">Applied Rule Schema</div>
                    <div className="text-sm font-bold text-cyan-400 font-mono">{ruleVersion}</div>
                    <div className="text-[11px] text-slate-400">Accuracy {activeInstrument.instrumentClass}</div>
                  </div>
                </div>
              </div>

              {/* Compliance Breakdown Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                
                {/* 1. Weighing Performance Test */}
                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-200">Weighing Performance</span>
                    <span className={perfResult?.passed ? 'text-emerald-400' : 'text-red-400'}>
                      {perfResult?.passed ? 'PASS ✓' : 'FAIL ✗'}
                    </span>
                  </div>
                  <div className="text-slate-400">
                    {perfResult?.passedPoints} of {perfResult?.totalPoints} load steps passed.
                  </div>
                  <div className="text-slate-400">
                    Max Error: <span className="font-mono text-white">±{perfResult?.maxErrorPoint?.absError} {unit}</span>
                  </div>
                </div>

                {/* 2. Repeatability */}
                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-200">Repeatability (ΔE)</span>
                    <span className={repResult?.passed ? 'text-emerald-400' : 'text-red-400'}>
                      {repResult?.passed ? 'PASS ✓' : 'FAIL ✗'}
                    </span>
                  </div>
                  <div className="text-slate-400">
                    Spread: <span className="font-mono text-white">{repResult?.deltaE} {unit}</span> (Limit: ±{repResult?.mpeLimit} {unit})
                  </div>
                  <div className="text-slate-400">3 Runs Evaluated</div>
                </div>

                {/* 3. Eccentricity */}
                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-200">Platter Eccentricity</span>
                    <span className={eccResult?.passed ? 'text-emerald-400' : 'text-red-400'}>
                      {eccResult?.passed ? 'PASS ✓' : 'FAIL ✗'}
                    </span>
                  </div>
                  <div className="text-slate-400">
                    Off-center 1/3 Max loading across 5 platter quadrants.
                  </div>
                  <div className="text-slate-400">{eccResult?.totalPositions} Positions Verified</div>
                </div>

              </div>

              {/* Error Curve & MPE Tolerance Envelope Visualization */}
              <ToleranceChart 
                evaluatedPoints={perfResult?.evaluatedPoints} 
                unit={unit} 
                maxCapacity={activeInstrument.capacity} 
              />

              {/* Detailed Points Table with Tolerance Progress Gauges */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-cyan-400" />
                  Detailed Metrological Load Points & Tolerance Utilization
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
                        <th className="py-2 px-3">#</th>
                        <th className="py-2 px-3">Applied Load</th>
                        <th className="py-2 px-3">Indication</th>
                        <th className="py-2 px-3">Corrected Error</th>
                        <th className="py-2 px-3">MPE Limit</th>
                        <th className="py-2 px-3">Tolerance Utilization</th>
                        <th className="py-2 px-3 text-right">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-sans">
                      {perfResult?.evaluatedPoints?.map((pt, idx) => (
                        <tr key={pt.id} className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-mono text-white">
                            {pt.appliedLoad} {unit} <span className="text-[10px] text-slate-500">({pt.direction})</span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-300">{pt.indicatedValue} {unit}</td>
                          <td className="py-2.5 px-3 font-mono">
                            <span className={pt.passed ? 'text-emerald-400' : 'text-red-400 font-bold'}>
                              {pt.correctedError >= 0 ? '+' : ''}{pt.correctedError} {unit}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-400">
                            ±{pt.mpeLimit} {unit}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="w-32">
                              <div className="flex justify-between text-[10px] mb-1 font-mono">
                                <span className="text-slate-400">{pt.marginPercent}%</span>
                                <span className={pt.marginPercent <= 100 ? 'text-emerald-400' : 'text-red-400'}>
                                  {pt.marginPercent <= 100 ? 'Safe' : 'Exceeded'}
                                </span>
                              </div>
                              <div className="gauge-bar">
                                <div 
                                  className={`gauge-fill ${pt.marginPercent <= 70 ? 'bg-cyan-400' : pt.marginPercent <= 100 ? 'bg-amber-400' : 'bg-red-500'}`}
                                  style={{ width: `${Math.min(pt.marginPercent, 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span className={`badge ${pt.passed ? 'badge-pass' : 'badge-fail'}`}>
                              {pt.passed ? 'PASS' : 'FAIL'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
                <button onClick={() => setStep(2)} className="btn-secondary w-full sm:w-auto">
                  <RotateCcw className="w-4 h-4" />
                  <span>Modify Observations</span>
                </button>

                <button 
                  onClick={handleGenerateReport} 
                  className="btn-primary bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-6 py-3 rounded-xl shadow-xl shadow-emerald-600/20 w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>Issue & Sign Test Certificate (PDF)</span>
                </button>
              </div>
            </>
          )}

        </div>
      )}

    </div>
  );
}
