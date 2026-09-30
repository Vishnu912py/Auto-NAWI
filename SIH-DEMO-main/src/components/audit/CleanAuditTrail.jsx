import React, { useState } from 'react';
import { ChevronRight, Search, ChevronLeft } from 'lucide-react';

export default function CleanAuditTrail() {
  const [userFilter, setUserFilter] = useState('All Users');
  const [actionFilter, setActionFilter] = useState('All Actions');
  const [currentPage, setCurrentPage] = useState(1);

  const logs = [
    { dateTime: '25 Nov 2025 10:32', user: 'Anita Sharma', action: 'Generated Report', details: 'TR-2025-011', ip: '192.168.1.10' },
    { dateTime: '25 Nov 2025 10:28', user: 'Anita Sharma', action: 'Completed Test', details: 'TR-2025-011', ip: '192.168.1.10' },
    { dateTime: '25 Nov 2025 09:15', user: 'Anita Sharma', action: 'Added Instrument', details: 'ABC-1000', ip: '192.168.1.10' },
    { dateTime: '24 Nov 2025 16:20', user: 'Rohan Mehta', action: 'Logged In', details: '-', ip: '192.168.1.12' },
    { dateTime: '24 Nov 2025 14:10', user: 'Admin', action: 'Updated Rule Set', details: 'R-76-1 (2011)', ip: '192.168.1.5' },
  ];

  return (
    <div className="space-y-4">
      
      {/* Breadcrumb */}
      <div className="breadcrumb-text">
        <span className="active">Audit Logs</span>
      </div>

      {/* Main Container */}
      <div className="ui-card p-6 space-y-5">
        <h1 className="text-base font-bold text-slate-900">
          Audit Trail
        </h1>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
          <div className="sm:col-span-3">
            <label className="form-label">User</label>
            <select 
              className="form-control text-xs"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            >
              <option value="All Users">All Users</option>
              <option value="Anita Sharma">Anita Sharma</option>
              <option value="Rohan Mehta">Rohan Mehta</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <label className="form-label">Action</label>
            <select 
              className="form-control text-xs"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <option value="All Actions">All Actions</option>
              <option value="Generated Report">Generated Report</option>
              <option value="Completed Test">Completed Test</option>
              <option value="Added Instrument">Added Instrument</option>
              <option value="Logged In">Logged In</option>
              <option value="Updated Rule Set">Updated Rule Set</option>
            </select>
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
            <button className="w-full btn-primary text-xs py-2">
              Search
            </button>
          </div>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>User</th>
                <th>Action</th>
                <th>Details</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l, i) => (
                <tr key={i}>
                  <td className="text-slate-500 whitespace-nowrap font-mono">{l.dateTime}</td>
                  <td className="font-semibold text-slate-800">{l.user}</td>
                  <td className="text-blue-600 font-medium">{l.action}</td>
                  <td className="font-mono text-slate-700">{l.details}</td>
                  <td className="font-mono text-slate-500">{l.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 pt-2">
          <div>
            Showing 1 to 5 of 142 records
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
