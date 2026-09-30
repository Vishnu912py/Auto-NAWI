import React, { useState } from 'react';
import { ChevronRight, Plus, Search, Eye, Scale } from 'lucide-react';

export default function CleanInstrumentsList({ onNewInstrument, onStartTestForInst }) {
  const [searchTerm, setSearchTerm] = useState('');

  const instruments = [
    { id: 'WL-2025-017', model: 'ABC-1000', manufacturer: 'ABC Weighing Pvt. Ltd.', serial: 'SN1234567', class: 'III', max: '1000 kg', min: '20 kg', e: '0.2 kg', status: 'Active' },
    { id: 'WL-2025-016', model: 'XYZ-500', manufacturer: 'XYZ Instruments', serial: 'SN998124', class: 'II', max: '500 g', min: '0.5 g', e: '0.01 g', status: 'Active' },
    { id: 'WL-2025-015', model: 'DEF-2000', manufacturer: 'DEF Weighing Co.', serial: 'SN882109', class: 'III', max: '2000 kg', min: '40 kg', e: '0.5 kg', status: 'Active' },
    { id: 'WL-2025-014', model: 'LM-100', manufacturer: 'LM Tech Pvt. Ltd.', serial: 'SN771920', class: 'III', max: '150 kg', min: '1 kg', e: '0.05 kg', status: 'Active' },
    { id: 'WL-2025-013', model: 'Secura-225', manufacturer: 'Sartorius Metrology', serial: 'SN661902', class: 'I', max: '220 g', min: '0.01 g', e: '0.001 g', status: 'Active' },
  ];

  const filtered = instruments.filter(i => 
    i.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="breadcrumb-text">
        <span className="active">Instruments</span>
      </div>

      <div className="ui-card p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-base font-bold text-slate-900">
            Registered Instruments (NAWI)
          </h1>
          <button onClick={onNewInstrument} className="btn-primary text-xs font-semibold">
            <Plus className="w-4 h-4" />
            <span>Register New Instrument</span>
          </button>
        </div>

        <div className="flex gap-2 max-w-sm">
          <input 
            type="text" 
            placeholder="Search instruments..." 
            className="form-control text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="data-table">
            <thead>
              <tr>
                <th>Instrument ID</th>
                <th>Model</th>
                <th>Manufacturer</th>
                <th>Serial Number</th>
                <th>Class</th>
                <th>Capacity (Max)</th>
                <th>e</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inst => (
                <tr key={inst.id}>
                  <td className="font-mono text-blue-600 font-bold">{inst.id}</td>
                  <td className="font-semibold text-slate-800">{inst.model}</td>
                  <td className="text-slate-600">{inst.manufacturer}</td>
                  <td className="font-mono text-slate-700">{inst.serial}</td>
                  <td>
                    <span className="status-badge status-badge-info font-bold">
                      Class {inst.class}
                    </span>
                  </td>
                  <td className="font-mono text-slate-800 font-semibold">{inst.max}</td>
                  <td className="font-mono text-slate-600">{inst.e}</td>
                  <td className="text-center">
                    <button 
                      onClick={() => onStartTestForInst(inst)}
                      className="btn-outline-blue text-[11px] py-1 px-2"
                    >
                      Start Test
                    </button>
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
