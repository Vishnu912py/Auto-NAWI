import React, { useState } from 'react';
import { 
  FileCheck2, 
  Download, 
  Eye, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Printer, 
  Lock, 
  QrCode,
  ExternalLink,
  Award
} from 'lucide-react';
import { generateOIMLTestReportPDF } from '../../utils/pdfGenerator';
import { generateDigitalSignature } from '../../core/cryptoUtils';
import { logAuditAction } from '../../core/mockStore';

export default function ReportRepository({ 
  store, 
  currentUser, 
  onNavigateToVerify 
}) {
  const { reports = [], tests = [], instruments = [], labs = [] } = store;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const filteredReports = reports.filter(r => {
    const inst = instruments.find(i => i.id === r.instrumentId);
    return (
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reportNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst?.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Download PDF Handler
  const handleDownloadPDF = async (report) => {
    setGeneratingPdf(true);
    try {
      const test = tests.find(t => t.id === report.testId) || report.testDataSnapshot;
      const inst = instruments.find(i => i.id === report.instrumentId);
      const lab = labs.find(l => l.id === report.labId);

      const doc = await generateOIMLTestReportPDF({
        testData: test,
        instrument: inst,
        lab,
        report,
        signature: report.digitalSignature
      });

      doc.save(`${report.reportNumber?.replace(/\//g, '_') || report.id}_Certificate.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setGeneratingPdf(false);
    }
  };

  // Sign Report (for Reviewer / Approver persona)
  const handleSignReport = async (report) => {
    const timestamp = new Date().toISOString();
    const signature = await generateDigitalSignature({
      reportId: report.id,
      hash: report.sha256Hash,
      signerName: currentUser.name,
      signerRole: currentUser.roleLabel || 'Certifying Officer',
      timestamp
    });

    report.digitalSignature = signature;
    report.status = 'ISSUED_AND_SIGNED';

    logAuditAction(store, {
      action: 'DIGITAL_SIGNATURE_APPLIED',
      category: 'SECURITY',
      details: `Digitally signed report ${report.id} (${report.reportNumber}) using PKCS#7 token ${signature.signatureToken}`,
      user: currentUser
    });

    // force re-render
    setSelectedReport({ ...report });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-cyan">Document Repository</span>
            <span className="text-xs text-slate-400 font-mono">{reports.length} Total Certificates</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Standardized OIML R-76 Test Certificates
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Official type-evaluation records with cryptographic SHA-256 integrity hashes and verifiable digital signatures.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-4 flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search by report ID, serial number, model..." 
            className="form-input pl-9 text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Reports Table */}
      <div className="glass-panel p-5 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
              <th className="py-2.5 px-3">Report Number</th>
              <th className="py-2.5 px-3">Instrument</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Verdict</th>
              <th className="py-2.5 px-3">Digital Signature</th>
              <th className="py-2.5 px-3">SHA-256 Fingerprint</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {filteredReports.map(rep => {
              const inst = instruments.find(i => i.id === rep.instrumentId);
              const isPass = rep.result === 'PASS';

              return (
                <tr key={rep.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white font-mono">{rep.reportNumber || rep.id}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{rep.id}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-200">{inst?.model || 'NAWI Scale'}</div>
                    <div className="text-[10px] text-slate-400 font-mono">SN: {inst?.serialNumber}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {rep.generatedAt?.split('T')[0] || '2026-09-09'}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`badge ${isPass ? 'badge-pass' : 'badge-fail'}`}>
                      {isPass ? '✓ PASS' : '✗ FAIL'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {rep.digitalSignature ? (
                      <span className="badge badge-purple text-[10px] flex items-center gap-1 w-fit">
                        <Lock className="w-3 h-3" /> Signed
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">Unsigned Draft</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-slate-400">
                    {rep.sha256Hash?.substring(0, 12)}...
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button
                      onClick={() => setSelectedReport(rep)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(rep)}
                      disabled={generatingPdf}
                      className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 rounded text-[11px] font-medium transition-colors inline-flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Report Preview Modal */}
      {selectedReport && (
        <div className="modal-backdrop">
          <div className="modal-content p-6 max-w-3xl">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-cyan">{selectedReport.reportNumber}</span>
                  <span className={`badge ${selectedReport.result === 'PASS' ? 'badge-pass' : 'badge-fail'}`}>
                    {selectedReport.result === 'PASS' ? '✓ CERTIFIED' : '✗ REJECTED'}
                  </span>
                </div>
                <h2 className="text-lg font-extrabold text-white mt-1">
                  OIML R-76-2 Test Certificate Preview
                </h2>
              </div>
              <button onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-white text-xl font-bold">✕</button>
            </div>

            {/* Certificate Preview Card */}
            <div className="my-5 p-6 bg-slate-950 rounded-xl border border-slate-800 space-y-4 font-sans text-xs">
              <div className="text-center border-b border-slate-800 pb-3">
                <div className="font-bold text-sm text-white tracking-wide uppercase">
                  Government of India • Directorate of Legal Metrology
                </div>
                <div className="text-[11px] text-cyan-400">
                  National Metrology Testing Center • Type-Evaluation Test Certificate
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400">Report ID: </span>
                  <span className="font-mono text-white">{selectedReport.id}</span>
                </div>
                <div>
                  <span className="text-slate-400">Issued On: </span>
                  <span className="text-white">{selectedReport.generatedAt?.split('T')[0]}</span>
                </div>
                <div>
                  <span className="text-slate-400">Generated By: </span>
                  <span className="text-white">{selectedReport.generatedBy}</span>
                </div>
                <div>
                  <span className="text-slate-400">Status: </span>
                  <span className="font-semibold text-emerald-400">{selectedReport.status}</span>
                </div>
              </div>

              {/* Cryptographic Trust Seal */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    Cryptographic Integrity Proof
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">SHA-256 Ledger</span>
                </div>
                <div className="font-mono text-[11px] text-cyan-300 break-all bg-slate-950 p-2 rounded border border-slate-800">
                  {selectedReport.sha256Hash}
                </div>

                {selectedReport.digitalSignature ? (
                  <div className="text-slate-300 text-[11px] pt-1 space-y-0.5">
                    <div>Signer: <strong className="text-white">{selectedReport.digitalSignature.signerName}</strong> ({selectedReport.digitalSignature.signerRole})</div>
                    <div className="font-mono text-[10px] text-purple-300">Token: {selectedReport.digitalSignature.signatureToken}</div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-400 italic">Signature pending approval by Reviewer.</span>
                    {(currentUser.role === 'REVIEWER' || currentUser.role === 'ADMIN') && (
                      <button 
                        onClick={() => handleSignReport(selectedReport)}
                        className="btn-primary text-xs px-3 py-1.5"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Sign As Certifying Officer</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <button 
                onClick={() => onNavigateToVerify(selectedReport.id)}
                className="btn-secondary text-xs flex items-center gap-1.5"
              >
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span>Verify on Public Portal</span>
              </button>

              <button 
                onClick={() => handleDownloadPDF(selectedReport)}
                className="btn-primary text-xs flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Official Signed PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
