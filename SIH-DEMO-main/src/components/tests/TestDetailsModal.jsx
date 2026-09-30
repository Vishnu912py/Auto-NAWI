import React from 'react';
import { 
  Scale, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Layers, 
  ShieldCheck,
  Calendar,
  Thermometer,
  Droplets,
  Award
} from 'lucide-react';

export default function TestDetailsModal({ test, instrument, lab, onClose, onOpenCertificate }) {
  if (!test) return null;

  const unit = instrument?.unit || 'kg';
  const isPass = test.overallResult === 'PASS';

  return (
    <div className="modal-backdrop">
      <div className="modal-content p-6 max-w-4xl">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-cyan">{test.id}</span>
              <span className={`badge ${isPass ? 'badge-pass' : 'badge-fail'}`}>
                {isPass ? '✓ OIML R-76 COMPLIANT' : '✗ NON-COMPLIANT'}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">
              Metrological Compliance Evaluation Breakdown
            </h2>
            <p className="text-xs text-slate-400">
              Deterministic verification against {test.ruleVersion || 'OIML R-76-1:2006'}
            </p>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl font-bold p-1">✕</button>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5 text-xs">
          <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
            <div className="text-slate-400 font-semibold">Instrument Details</div>
            <div className="font-bold text-white text-sm">{instrument?.model}</div>
            <div className="font-mono text-slate-400">SN: {instrument?.serialNumber}</div>
            <div className="text-cyan-400 font-mono">Max: {instrument?.capacity} {unit} | e: {instrument?.scaleInterval} {unit}</div>
          </div>

          <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
            <div className="text-slate-400 font-semibold">Testing Laboratory & Officer</div>
            <div className="font-medium text-slate-200">{lab?.name}</div>
            <div className="text-slate-400">Technician: {test.technicianName}</div>
            <div className="text-slate-400">Reviewer: {test.reviewerName || 'Ananya Iyer'}</div>
          </div>

          <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
            <div className="text-slate-400 font-semibold">Environmental Log</div>
            <div className="text-slate-200">Temp: <span className="font-mono text-white">{test.environmental?.temperature}°C</span></div>
            <div className="text-slate-200">Humidity: <span className="font-mono text-white">{test.environmental?.humidity}% RH</span></div>
            <div className="text-slate-400 font-mono text-[10px]">Weights Ref: {test.environmental?.weightsSetNo}</div>
          </div>
        </div>

        {/* Detailed Points Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-cyan-400" />
            Weighing Performance Test Observation Math
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">Applied Load</th>
                  <th className="py-2 px-3">Indication (I)</th>
                  <th className="py-2 px-3">Corrected Error (Ec)</th>
                  <th className="py-2 px-3">Permissible (MPE)</th>
                  <th className="py-2 px-3 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {test.performanceTest?.evaluatedPoints?.map((pt, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono text-white">
                      {pt.appliedLoad} {unit} ({pt.direction})
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-300">{pt.indicatedValue} {unit}</td>
                    <td className="py-2.5 px-3 font-mono">
                      <span className={pt.passed ? 'text-emerald-400' : 'text-red-400 font-bold'}>
                        {pt.correctedError >= 0 ? '+' : ''}{pt.correctedError} {unit}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">±{pt.mpeLimit} {unit}</td>
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

        {/* Modal Actions */}
        <div className="flex justify-between items-center pt-5 mt-4 border-t border-slate-800">
          <button onClick={onClose} className="btn-secondary text-xs">Close</button>
          {test.reportId && (
            <button 
              onClick={() => {
                onClose();
                onOpenCertificate(test.reportId);
              }}
              className="btn-primary text-xs flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>View Official Certificate & PDF</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
