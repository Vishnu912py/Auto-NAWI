import React, { useState } from 'react';
import { 
  ChevronRight, 
  Search, 
  Eye, 
  Download, 
  Printer, 
  Calendar, 
  Filter,
  ChevronLeft
} from 'lucide-react';

export default function TestReportsList({ onViewReport }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const reports = [
    { id: 'TR-2025-011', instrument: 'ABC-1000', manufacturer: 'ABC Weighing Pvt. Ltd.', date: '25 Nov 2025', result: 'PASS' },
    { id: 'TR-2025-010', instrument: 'XYZ-500', manufacturer: 'XYZ Instruments', date: '24 Nov 2025', result: 'PASS' },
    { id: 'TR-2025-009', instrument: 'DEF-2000', manufacturer: 'DEF Weighing Co.', date: '20 Nov 2025', result: 'FAIL' },
    { id: 'TR-2025-008', instrument: 'LM-100', manufacturer: 'LM Tech Pvt. Ltd.', date: '19 Nov 2025', result: 'PASS' },
    { id: 'TR-2025-007', instrument: 'MT-3000', manufacturer: 'MeghTech India', date: '18 Nov 2025', result: 'PASS' },
  ];

  const filtered = reports.filter(r => {
    const matchSearch = (
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.instrument.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchStatus = statusFilter === 'All' || r.result === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4">
      
      {/* Breadcrumb */}
      <div className="breadcrumb-text">
        <span className="text-blue-600">Reports</span>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="active">Test Reports</span>
      </div>

      {/* Main Container */}
      <div className="ui-card p-6 space-y-5">
        <h1 className="text-base font-bold text-slate-900">
          Test Reports
        </h1>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
          <div className="sm:col-span-4">
            <label className="form-label">Search by Report No. / Instrument</label>
            <input 
              type="text" 
              placeholder="Search..." 
              className="form-control text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="form-label">From Date</label>
            <input type="date" className="form-control text-xs" />
          </div>

          <div className="sm:col-span-2">
            <label className="form-label">To Date</label>
            <input type="date" className="form-control text-xs" />
          </div>

          <div className="sm:col-span-2">
            <label className="form-label">Status</label>
            <select 
              className="form-control text-xs"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="PASS">PASS</option>
              <option value="FAIL">FAIL</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <button className="w-full btn-primary text-xs py-2">
              Search
            </button>
          </div>
        </div>

        {/* Reports Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="data-table">
            <thead>
              <tr>
                <th>Report No.</th>
                <th>Instrument</th>
                <th>Manufacturer</th>
                <th>Date</th>
                <th>Result</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td>
                    <button 
                      onClick={() => onViewReport(r.id)}
                      className="font-mono text-blue-600 hover:underline font-bold"
                    >
                      {r.id}
                    </button>
                  </td>
                  <td className="font-semibold text-slate-800">{r.instrument}</td>
                  <td className="text-slate-600">{r.manufacturer}</td>
                  <td className="text-slate-500 whitespace-nowrap">{r.date}</td>
                  <td>
                    <span className={`status-badge ${r.result === 'PASS' ? 'status-badge-pass' : 'status-badge-fail'}`}>
                      {r.result}
                    </span>
                  </td>
                  <td className="text-center space-x-2">
                    <button 
                      onClick={() => onViewReport(r.id)}
                      className="p-1 text-slate-500 hover:text-blue-600 transition-colors"
                      title="View Report"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onViewReport(r.id)}
                      className="p-1 text-slate-500 hover:text-blue-600 transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onViewReport(r.id)}
                      className="p-1 text-slate-500 hover:text-blue-600 transition-colors"
                      title="Print"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 pt-2">
          <div>
            Showing 1 to {filtered.length} of 25 reports
          </div>

          <div className="flex items-center gap-1">
            <button className="px-2 py-1 rounded border border-slate-200 text-slate-400 hover:bg-slate-50">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {[1, 2, 3, 4, 5].map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-7 h-7 rounded text-xs font-semibold ${
                  currentPage === p
                    ? 'bg-blue-600 text-white'
                    : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {p}
              </button>
            ))}
            <button className="px-2 py-1 rounded border border-slate-200 text-slate-700 hover:bg-slate-50">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
