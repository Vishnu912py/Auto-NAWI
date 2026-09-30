import React, { useState } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  QrCode, 
  CheckCircle2, 
  Lock, 
  FileCheck2, 
  Building2,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';

export default function CleanVerifyPortal({ onBackToDashboard }) {
  const [reportNumber, setReportNumber] = useState('TR-2025-011');
  const [verifiedResult, setVerifiedResult] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleVerify = (e) => {
    e?.preventDefault();
    setIsChecking(true);
    setVerifiedResult(null);

    setTimeout(() => {
      setIsChecking(false);
      if (reportNumber.trim() === 'TR-2025-011' || reportNumber.trim() === 'TR-2025-010') {
        setVerifiedResult({
          status: 'AUTHENTIC',
          reportNumber: reportNumber.trim(),
          date: '25 Nov 2025',
          lab: 'Regional Legal Metrology Laboratory, Delhi',
          instrument: 'ABC-1000 (SN1234567)',
          result: 'PASS',
          sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
          signer: 'Dr. Rajesh Kumar (Authorized Signatory)'
        });
      } else {
        setVerifiedResult({
          status: 'NOT_FOUND',
          message: 'No official record found for this report number.'
        });
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-6 sm:p-12 font-sans">
      
      {/* Top Bar Back Link */}
      <div className="max-w-3xl mx-auto w-full flex justify-between items-center">
        <button 
          onClick={onBackToDashboard}
          className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Laboratory Portal</span>
        </button>
        <span className="text-[11px] text-slate-400">Govt. of India Legal Metrology</span>
      </div>

      {/* Main Verification Card */}
      <div className="max-w-xl mx-auto w-full bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm text-center space-y-6 my-auto">
        
        {/* Brand Logo */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white">
              <Scale className="w-5 h-5" />
            </div>
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              Smart<span className="text-blue-600">NAWI</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
            Verify. Trust. Comply.
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-lg font-bold text-slate-900">
            Verify Test Report
          </h1>
          <p className="text-xs text-slate-500">
            Enter Report Number or Scan QR Code to verify authenticity
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Enter Report Number (e.g., TR-2025-011)"
              className="form-control text-xs py-2.5 font-mono"
              value={reportNumber}
              onChange={(e) => setReportNumber(e.target.value)}
            />
            <button type="submit" disabled={isChecking} className="btn-primary text-xs px-5 shrink-0 font-semibold">
              {isChecking ? 'Verifying...' : 'Verify'}
            </button>
          </div>

          <div className="relative flex items-center justify-center py-1">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[10px] text-slate-400 font-bold uppercase absolute">
              OR
            </span>
          </div>

          <button
            type="button"
            onClick={handleVerify}
            className="w-full btn-secondary py-2.5 text-xs font-semibold flex items-center justify-center gap-2 text-slate-700"
          >
            <QrCode className="w-4 h-4 text-blue-600" />
            <span>Scan QR Code</span>
          </button>
        </form>

        {/* Verification Result Card */}
        {verifiedResult && (
          <div className={`p-4 rounded-xl border text-left text-xs space-y-2 ${
            verifiedResult.status === 'AUTHENTIC'
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {verifiedResult.status === 'AUTHENTIC' ? (
              <>
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>✓ OFFICIAL CERTIFICATE VERIFIED</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-700 pt-1 text-[11px]">
                  <div>Report: <strong>{verifiedResult.reportNumber}</strong></div>
                  <div>Result: <strong className="text-emerald-700">{verifiedResult.result}</strong></div>
                  <div>Date: {verifiedResult.date}</div>
                  <div>Signer: {verifiedResult.signer}</div>
                  <div className="col-span-2 text-[10px] text-slate-500 font-mono break-all">
                    SHA-256: {verifiedResult.sha256}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>{verifiedResult.message}</span>
              </div>
            )}
          </div>
        )}

        {/* 3 Trust Badges */}
        <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-100 text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Authentic Reports</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Verify digital signature & PKI token
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-blue-600 font-bold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Trusted Authorities</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Official legal metrology laboratories
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-blue-600 font-bold text-[11px]">
              <Lock className="w-3.5 h-3.5" />
              <span>Public Access</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Transparency & consumer trust
            </p>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="max-w-3xl mx-auto w-full text-center text-xs text-slate-500 space-y-1 pt-6">
        <div>A step towards a fair and accurate marketplace</div>
        <div className="font-semibold text-slate-700">
          Department of Consumer Affairs | Government of India
        </div>
      </div>

    </div>
  );
}
