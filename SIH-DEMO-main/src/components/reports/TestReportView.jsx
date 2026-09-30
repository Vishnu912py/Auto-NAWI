import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Download, 
  FileText, 
  Printer, 
  QrCode, 
  CheckCircle2, 
  Scale, 
  Building2 
} from 'lucide-react';
import QRCode from 'qrcode';

export default function TestReportView({ onBack, onVerifyLink }) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    QRCode.toDataURL('https://smartnawi.doca.gov.in/verify?report=TR-2025-011', { width: 90, margin: 1 })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error(err));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      
      {/* Breadcrumb */}
      <div className="breadcrumb-text">
        <span className="text-blue-600 cursor-pointer" onClick={onBack}>Reports</span>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-blue-600">TR-2025-011</span>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="active">View Report</span>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200">
        <h1 className="text-base font-bold text-slate-900">Test Report</h1>
        <div className="flex items-center gap-2">
          <button onClick={handlePrint} className="btn-primary text-xs font-semibold">
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
          <button onClick={handlePrint} className="btn-secondary text-xs">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Download Word</span>
          </button>
          <button onClick={handlePrint} className="btn-secondary text-xs">
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* White Paper Document Certificate Preview */}
      <div className="certificate-paper space-y-6">
        
        {/* Document Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-slate-700" />
              <div className="font-bold text-xs uppercase tracking-wide text-slate-900">
                Government of India • Department of Consumer Affairs
              </div>
            </div>
            <div className="text-[11px] text-slate-600">
              Directorate of Legal Metrology • National Verification Testing System
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white">
              <Scale className="w-5 h-5" />
            </div>
            <div className="text-right">
              <div className="font-extrabold text-sm text-slate-900 tracking-tight">SmartNAWI</div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wider">Test. Verify. Certify.</div>
            </div>
          </div>
        </div>

        {/* Certificate Title & QR Code */}
        <div className="flex items-center justify-between py-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              TEST REPORT
            </h2>
            <div className="text-xs text-slate-600 font-medium">
              for Non-Automatic Weighing Instrument (NAWI) as per OIML R-76-1
            </div>
          </div>

          {qrCodeUrl && (
            <div className="text-center cursor-pointer" onClick={onVerifyLink}>
              <img src={qrCodeUrl} alt="QR Code" className="w-16 h-16 border border-slate-200 p-0.5 rounded mx-auto" />
              <div className="text-[8px] text-slate-500 font-medium mt-0.5">Scan to Verify</div>
            </div>
          )}
        </div>

        {/* Metadata Table */}
        <div className="border border-slate-200 rounded overflow-hidden text-xs">
          <table className="w-full">
            <tbody className="divide-y divide-slate-200">
              <tr className="divide-x divide-slate-200 bg-slate-50/50">
                <td className="py-2 px-3 font-semibold text-slate-600 w-1/3">Report No.</td>
                <td className="py-2 px-3 font-mono font-bold text-slate-900">TR-2025-011</td>
              </tr>
              <tr className="divide-x divide-slate-200">
                <td className="py-2 px-3 font-semibold text-slate-600">Date of Issue</td>
                <td className="py-2 px-3 text-slate-900">25 Nov 2025</td>
              </tr>
              <tr className="divide-x divide-slate-200 bg-slate-50/50">
                <td className="py-2 px-3 font-semibold text-slate-600">Laboratory</td>
                <td className="py-2 px-3 text-slate-900">Regional Legal Metrology Laboratory, Delhi</td>
              </tr>
              <tr className="divide-x divide-slate-200">
                <td className="py-2 px-3 font-semibold text-slate-600">Instrument Model</td>
                <td className="py-2 px-3 text-slate-900 font-semibold">ABC-1000</td>
              </tr>
              <tr className="divide-x divide-slate-200 bg-slate-50/50">
                <td className="py-2 px-3 font-semibold text-slate-600">Serial Number</td>
                <td className="py-2 px-3 font-mono text-slate-900">SN1234567</td>
              </tr>
              <tr className="divide-x divide-slate-200">
                <td className="py-2 px-3 font-semibold text-slate-600">Manufacturer</td>
                <td className="py-2 px-3 text-slate-900">ABC Weighing Pvt. Ltd.</td>
              </tr>
              <tr className="divide-x divide-slate-200 bg-slate-50/50">
                <td className="py-2 px-3 font-semibold text-slate-600">Accuracy Class</td>
                <td className="py-2 px-3 text-slate-900">III</td>
              </tr>
              <tr className="divide-x divide-slate-200">
                <td className="py-2 px-3 font-semibold text-slate-600">Max / Min</td>
                <td className="py-2 px-3 font-mono text-slate-900">1000 kg / 20 kg</td>
              </tr>
              <tr className="divide-x divide-slate-200 bg-slate-50/50">
                <td className="py-2 px-3 font-semibold text-slate-600">Verification Scale Interval (e)</td>
                <td className="py-2 px-3 font-mono text-slate-900">0.2 kg</td>
              </tr>
              <tr className="divide-x divide-slate-200">
                <td className="py-2 px-3 font-semibold text-slate-600">Rule Applied</td>
                <td className="py-2 px-3 text-slate-900">OIML R-76-1 (2011)</td>
              </tr>
              <tr className="divide-x divide-slate-200 bg-emerald-50/40">
                <td className="py-2.5 px-3 font-semibold text-emerald-800">Result</td>
                <td className="py-2.5 px-3 font-black text-emerald-700 text-sm">PASS</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signatures Section */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-xs">
          <div className="space-y-1">
            <div className="text-slate-500">Tested By:</div>
            <div className="font-bold text-slate-900">Anita Sharma</div>
            <div className="text-[10px] text-slate-500">Lab Technician</div>
          </div>

          <div className="space-y-1 text-right">
            <div className="text-slate-500">Approved By:</div>
            <div className="font-bold text-slate-900">Dr. Rajesh Kumar</div>
            <div className="text-[10px] text-slate-500">Authorized Signatory • (Digitally Signed)</div>
            <div className="text-blue-600 italic font-serif text-sm pt-1">R.Kumar (PKI Token #9823)</div>
          </div>
        </div>

      </div>

    </div>
  );
}
