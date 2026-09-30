import React from 'react';
import { Users, Plus, ShieldCheck, Mail } from 'lucide-react';

export default function CleanUsersList() {
  const users = [
    { id: 'U-01', name: 'Anita Sharma', role: 'Lab Technician', email: 'anita.sharma@lab.gov.in', status: 'Active', avatar: '👩‍🔬' },
    { id: 'U-02', name: 'Dr. Rajesh Kumar', role: 'Authorized Signatory / Approver', email: 'rajesh.kumar@doca.gov.in', status: 'Active', avatar: '👨‍💼' },
    { id: 'U-03', name: 'Rohan Mehta', role: 'Metrology Inspector', email: 'rohan.mehta@lab.gov.in', status: 'Active', avatar: '🔍' },
    { id: 'U-04', name: 'Dr. Priya Sharma', role: 'System Administrator', email: 'priya.sharma@gov.in', status: 'Active', avatar: '🛡️' },
  ];

  return (
    <div className="space-y-4">
      <div className="breadcrumb-text">
        <span className="active">Users</span>
      </div>

      <div className="ui-card p-6 space-y-5">
        <div className="flex justify-between items-center">
          <h1 className="text-base font-bold text-slate-900">
            Authorized Personnel & Role Management (RBAC)
          </h1>
          <button className="btn-primary text-xs font-semibold">
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td className="flex items-center gap-2.5 font-semibold text-slate-800">
                    <span className="text-base">{u.avatar}</span>
                    <span>{u.name}</span>
                  </td>
                  <td>
                    <span className="status-badge status-badge-info font-bold">
                      {u.role}
                    </span>
                  </td>
                  <td className="text-slate-600 font-mono text-xs">{u.email}</td>
                  <td>
                    <span className="status-badge status-badge-pass">
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
