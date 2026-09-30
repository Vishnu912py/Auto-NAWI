import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Download, 
  ShieldCheck, 
  Filter, 
  Calendar,
  User,
  Activity,
  Lock,
  Cpu,
  FileCheck2
} from 'lucide-react';

export default function AuditLogViewer({ store }) {
  const { auditLogs = [] } = store;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchSearch = (
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchCat = selectedCategory === 'ALL' || log.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleExportCSV = () => {
    const headers = ['Audit ID', 'Timestamp', 'User ID', 'User Name', 'Action', 'Category', 'Details'];
    const rows = filteredLogs.map(l => [
      l.id,
      l.timestamp,
      l.userId,
      `"${l.userName}"`,
      l.action,
      l.category,
      `"${l.details?.replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SmartNAWI_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-cyan">Traceability & Compliance</span>
            <span className="text-xs text-slate-400 font-mono">{auditLogs.length} Events Recorded</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Immutable Metrological Audit Trail
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Complete tamper-resistant activity ledger tracking every login, test calculation, certificate issuance, and verification check.
          </p>
        </div>

        <button 
          onClick={handleExportCSV}
          className="btn-secondary text-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Audit Ledger (CSV)</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="glass-panel p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search audit actions, users, records..." 
            className="form-input pl-9 text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-400">Category:</span>
          {['ALL', 'TEST_EXECUTION', 'RULE_ENGINE', 'CERTIFICATION', 'SECURITY', 'AUTH'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Table */}
      <div className="glass-panel p-5 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">Actor / User</th>
              <th className="py-2.5 px-3">Action Event</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Details & Audit Context</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {filteredLogs.map(log => {
              const isSecurity = log.category === 'SECURITY';
              const isRule = log.category === 'RULE_ENGINE';

              return (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-mono text-slate-400 whitespace-nowrap">
                    {log.timestamp?.replace('T', ' ')?.substring(0, 19)}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-white">{log.userName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{log.userId}</div>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <span className={`font-bold ${isSecurity ? 'text-purple-400' : isRule ? 'text-cyan-400' : 'text-slate-200'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="badge badge-cyan text-[10px]">
                      {log.category?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 max-w-md">
                    {log.details}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
