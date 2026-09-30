import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  QrCode, 
  FileCheck2, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Upload, 
  RefreshCw,
  Lock,
  Scale,
  Sparkles
} from 'lucide-react';
import { calculateSHA256 } from '../../core/cryptoUtils';
import { logAuditAction } from '../../core/mockStore';

export default function VerificationPortal({ store, currentUser, initialReportId = '' }) {
  const { reports = [], tests = [], instruments = [], labs = [] } = store;

  const [queryId, setQueryId] = useState(initialReportId || (reports[0]?.id || ''));
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  
  // Interactive Tamper Simulation State
  const [tamperedData, setTamperedData] = useState(null);
  const [isTamperedMode, setIsTamperedMode] = useState(false);

  // Auto-verify if initialReportId is provided
  useEffect(() => {
    if (initialReportId) {
      setQueryId(initialReportId);
      performVerification(initialReportId, false);
    }
  }, [initialReportId]);

  const performVerification = async (targetId, simulateTamper = false) => {
    setVerifying(true);
    setVerificationResult(null);

    const report = reports.find(r => r.id === targetId || r.reportNumber === targetId);

    setTimeout(async () => {
      if (!report) {
        setVerificationResult({
          status: 'NOT_FOUND',
          message: 'No record found with this Certificate / Report ID in the National Metrology Ledger.'
        });
        setVerifying(false);
        return;
      }

      const originalPayload = report.testDataSnapshot;
      let payloadToHash = { ...originalPayload };

      if (simulateTamper) {
        // Deliberately tamper with the payload to demonstrate cryptographic rejection
        payloadToHash = JSON.parse(JSON.stringify(originalPayload));
        if (payloadToHash.performanceTest?.evaluatedPoints?.length > 0) {
          payloadToHash.performanceTest.evaluatedPoints[0].indicatedValue += 999.0;
          payloadToHash.environmental.temperature = 99.9; // Tampered!
        }
      }

      const calculatedHash = await calculateSHA256(payloadToHash);
      const isGenuine = calculatedHash === report.sha256Hash && !simulateTamper;

      const inst = instruments.find(i => i.id === report.instrumentId);
      const lab = labs.find(l => l.id === report.labId);

      setVerificationResult({
        status: isGenuine ? 'GENUINE' : 'TAMPERED',
        report,
        test: report.testDataSnapshot,
        instrument: inst,
        lab,
        calculatedHash,
        storedHash: report.sha256Hash,
        isTamperSimulation: simulateTamper
      });

      logAuditAction(store, {
        action: isGenuine ? 'VERIFICATION_SUCCESS' : 'VERIFICATION_TAMPER_ALERT',
        category: 'SECURITY',
        details: `Public verification queried for ${report.id} -> ${isGenuine ? 'VALID & AUTHENTIC' : 'TAMPER DETECTED / MISMATCH'}`,
        user: currentUser
      });

      setVerifying(false);
    }, 500);
  };

  const handleVerify = (e) => {
    e?.preventDefault();
    if (!queryId) return;
    performVerification(queryId, false);
  };

  const handleSimulateTamper = () => {
    setIsTamperedMode(true);
    performVerification(queryId || reports[0]?.id, true);
  };

  const handleResetGenuine = () => {
    setIsTamperedMode(false);
    performVerification(queryId || reports[0]?.id, false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Hero Header */}
      <div className="glass-panel p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Public Metrological Verification & Tamper-Check Portal
        </h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Instant cryptographic validation of OIML R-76 test certificates issued by the Department of Consumer Affairs. Scan QR code, enter Report ID, or simulate post-issuance data tampering.
        </p>

        {/* Search Bar Form */}
        <form onSubmit={handleVerify} className="max-w-xl mx-auto flex gap-2 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              required
              placeholder="Enter Certificate / Report ID (e.g. RPT-2026-DOCA-1023)" 
              className="form-input pl-9 text-xs font-mono"
              value={queryId}
              onChange={(e) => setQueryId(e.target.value)}
            />
          </div>
          <button type="submit" disabled={verifying} className="btn-primary text-xs px-4">
            {verifying ? 'Checking Ledger...' : 'Verify Authenticity'}
          </button>
        </form>

        {/* Fast Select Preset Certificates */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
          <span className="text-slate-400">Quick Test IDs:</span>
          {reports.slice(0, 3).map(r => (
            <button
              key={r.id}
              onClick={() => {
                setQueryId(r.id);
                performVerification(r.id, false);
              }}
              className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-cyan-300 font-mono text-[11px] border border-slate-700"
            >
              {r.id}
            </button>
          ))}
        </div>
      </div>

      {/* Demo Pitch Moment: Interactive Tamper Simulation Box */}
      <div className="glass-panel p-4 bg-amber-950/20 border border-amber-500/40">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                SIH Hackathon Pitch Demo: Cryptographic Tamper Defense
              </div>
              <div className="text-[11px] text-slate-300">
                Show judges how modifying a single digit after issuance breaks the SHA-256 checksum and triggers rejection.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateTamper}
              className="px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-500/50 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>Simulate Tampered Data</span>
            </button>
            <button
              onClick={handleResetGenuine}
              className="px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/50 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Restore Genuine</span>
            </button>
          </div>
        </div>
      </div>

      {/* Verification Result Display */}
      {verifying && (
        <div className="glass-panel p-12 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-sm font-bold text-white">Calculating SHA-256 Checksum from Data Payload...</div>
          <div className="text-xs text-slate-400">Querying National Metrology Immutable Hash Ledger</div>
        </div>
      )}

      {verificationResult && !verifying && (
        <div className="space-y-4">
          
          {/* Status Verdict Header */}
          <div className={`p-6 rounded-2xl border ${
            verificationResult.status === 'GENUINE'
              ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
              : 'bg-red-950/40 border-red-500/60 shadow-lg shadow-red-500/10'
          }`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                  verificationResult.status === 'GENUINE'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {verificationResult.status === 'GENUINE' ? (
                    <CheckCircle2 className="w-10 h-10" />
                  ) : (
                    <ShieldAlert className="w-10 h-10" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Verification Outcome
                  </span>
                  <h2 className="text-2xl font-black text-white">
                    {verificationResult.status === 'GENUINE'
                      ? '✓ OFFICIAL CERTIFICATE VERIFIED & UNMODIFIED'
                      : '✗ TAMPER ALERT: DATA INTEGRITY MISMATCH!'}
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {verificationResult.status === 'GENUINE'
                      ? 'Calculated SHA-256 checksum exactly matches the issued National Metrology Certificate ledger.'
                      : 'WARNING: The certificate contents have been altered after issuance. The SHA-256 hash does NOT match the official record!'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cryptographic Comparison Matrix */}
          <div className="glass-panel p-5 space-y-4 text-xs font-mono">
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              Cryptographic SHA-256 Hash Comparison
            </h3>

            <div className="space-y-2">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Stored Hash on Legal Metrology Ledger:</div>
                <div className="text-cyan-300 break-all font-semibold mt-1">
                  {verificationResult.storedHash || 'N/A'}
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Calculated Hash of Presented Data:</div>
                <div className={`break-all font-semibold mt-1 ${
                  verificationResult.status === 'GENUINE' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {verificationResult.calculatedHash || 'N/A'}
                </div>
              </div>
            </div>

            {/* Instrument & Lab Metadata Summary */}
            {verificationResult.report && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800 font-sans">
                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Instrument Verified</div>
                  <div className="font-bold text-white text-sm">{verificationResult.instrument?.model}</div>
                  <div className="text-slate-400 text-xs font-mono">SN: {verificationResult.instrument?.serialNumber}</div>
                  <div className="text-cyan-400 text-xs">Class: {verificationResult.instrument?.instrumentClass}</div>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Issuing Authority</div>
                  <div className="font-medium text-slate-200">{verificationResult.lab?.name}</div>
                  <div className="text-slate-400 text-xs">Signed By: {verificationResult.report.digitalSignature?.signerName || 'Certifying Officer'}</div>
                  <div className="text-emerald-400 text-xs">Verdict: {verificationResult.report.result}</div>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
