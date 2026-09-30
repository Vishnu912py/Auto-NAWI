import React, { useState } from 'react';
import { Settings, Save, Building2, ShieldCheck, Database } from 'lucide-react';

export default function CleanSettings() {
  const [labName, setLabName] = useState('Regional Legal Metrology Laboratory, Delhi');
  const [labCode, setLabCode] = useState('RRSL-DEL-01');
  const [accreditation, setAccreditation] = useState('NABL ISO/IEC 17025:2017 (Cert # CC-2489)');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="breadcrumb-text">
        <span className="active">Settings</span>
      </div>

      <div className="ui-card p-6 space-y-6 max-w-2xl">
        <h1 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Laboratory & System Settings
        </h1>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="form-label">Designated Laboratory Name</label>
            <input 
              type="text" 
              className="form-control"
              value={labName}
              onChange={(e) => setLabName(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Laboratory Code / Identifier</label>
            <input 
              type="text" 
              className="form-control font-mono"
              value={labCode}
              onChange={(e) => setLabCode(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">NABL Accreditation Number</label>
            <input 
              type="text" 
              className="form-control"
              value={accreditation}
              onChange={(e) => setAccreditation(e.target.value)}
            />
          </div>

          <div className="pt-2 flex justify-between items-center">
            {saved ? (
              <span className="text-xs text-emerald-700 font-semibold">✓ Settings saved successfully!</span>
            ) : <span />}
            <button type="submit" className="btn-primary text-xs font-semibold">
              <Save className="w-3.5 h-3.5" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
