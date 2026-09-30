import React, { useState } from 'react';
import { ChevronRight, Plus, ArrowRight, ArrowLeft } from 'lucide-react';

export default function EnterObservations({ onPrevious, onNext }) {
  const [activeTestTab, setActiveTestTab] = useState(1);
  const [rows, setRows] = useState([
    { id: 1, testLoad: 0, indicatedValue: 0.000, error: 0.000 },
    { id: 2, testLoad: 20, indicatedValue: 20.002, error: 0.002 },
    { id: 3, testLoad: 100, indicatedValue: 100.004, error: 0.004 },
    { id: 4, testLoad: 500, indicatedValue: 500.006, error: 0.006 },
    { id: 5, testLoad: 1000, indicatedValue: 1000.008, error: 0.008 },
  ]);

  const handleUpdate = (id, field, value) => {
    setRows(rows.map(r => {
      if (r.id === id) {
        const updated = { ...r, [field]: value };
        if (field === 'testLoad' || field === 'indicatedValue') {
          const l = parseFloat(field === 'testLoad' ? value : r.testLoad) || 0;
          const i = parseFloat(field === 'indicatedValue' ? value : r.indicatedValue) || 0;
          updated.error = Number((i - l).toFixed(4));
        }
        return updated;
      }
      return r;
    }));
  };

  const handleAddRow = () => {
    const last = rows[rows.length - 1]?.testLoad || 0;
    const newL = Number((last + 200).toFixed(1));
    setRows([...rows, { id: Date.now(), testLoad: newL, indicatedValue: newL, error: 0.000 }]);
  };

  return (
    <div className="space-y-4">
      
      {/* Breadcrumb */}
      <div className="breadcrumb-text">
        <span className="text-blue-600">Test Management</span>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-blue-600">New Test</span>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="active">Enter Observations</span>
      </div>

      {/* Main Card */}
      <div className="ui-card p-6 space-y-6">
        
        {/* Title */}
        <h1 className="text-base font-bold text-slate-900">
          Enter Test Observations
        </h1>

        {/* 3-Step Stepper */}
        <div className="flex items-center justify-center max-w-xl mx-auto py-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">1</div>
            <span className="text-xs text-slate-600 font-medium">Instrument Details</span>
          </div>
          <div className="w-16 h-0.5 bg-blue-600 mx-3" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">2</div>
            <span className="text-xs font-bold text-blue-600">Test Observations</span>
          </div>
          <div className="w-16 h-0.5 bg-slate-200 mx-3" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-semibold">3</div>
            <span className="text-xs text-slate-400">Review & Submit</span>
          </div>
        </div>

        {/* 2-Col Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2 border-t border-slate-100">
          
          {/* Left Column (4 cols): Test Information & Sub-tests list */}
          <div className="md:col-span-4 space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
              <h3 className="font-bold text-slate-900">Test Information</h3>
              <div className="space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Instrument:</span>
                  <strong className="text-slate-900">ABC-1000 (SN1234567)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Accuracy Class:</span>
                  <strong className="text-slate-900">III</strong>
                </div>
                <div className="flex justify-between">
                  <span>Max / Min:</span>
                  <strong className="text-slate-900">1000 kg / 20 kg</strong>
                </div>
                <div className="flex justify-between">
                  <span>e:</span>
                  <strong className="text-slate-900">0.2 kg</strong>
                </div>
                <div className="flex justify-between">
                  <span>Test Type:</span>
                  <strong className="text-slate-900">Accuracy Test (Increasing Load)</strong>
                </div>
              </div>
            </div>

            {/* Sub-test tabs */}
            <div className="space-y-1 text-xs font-medium">
              {[
                { id: 1, label: '1. Accuracy Test (Increasing Load)' },
                { id: 2, label: '2. Accuracy Test (Decreasing Load)' },
                { id: 3, label: '3. Repeatability Test' },
                { id: 4, label: '4. Eccentricity Test' },
                { id: 5, label: '5. Zero/Tare Test' },
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTestTab(t.id)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeTestTab === t.id
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column (8 cols): Observation Table */}
          <div className="md:col-span-8 space-y-4">
            <h3 className="text-xs font-bold text-slate-900">
              Accuracy Test (Increasing Load)
            </h3>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Test Load (kg)</th>
                    <th>Indicated Value (kg)</th>
                    <th>Error (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r => (
                    <tr key={r.id}>
                      <td>
                        <input
                          type="number"
                          step="any"
                          className="form-control text-xs py-1"
                          value={r.testLoad}
                          onChange={(e) => handleUpdate(r.id, 'testLoad', parseFloat(e.target.value) || 0)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="any"
                          className="form-control text-xs py-1"
                          value={r.indicatedValue}
                          onChange={(e) => handleUpdate(r.id, 'indicatedValue', parseFloat(e.target.value) || 0)}
                        />
                      </td>
                      <td className="font-mono text-slate-800 font-semibold">
                        {r.error >= 0 ? `${r.error.toFixed(3)}` : r.error.toFixed(3)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={handleAddRow}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Row</span>
            </button>
          </div>

        </div>

        {/* Bottom Stepper Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <button type="button" onClick={onPrevious} className="btn-secondary">
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          <button type="button" onClick={onNext} className="btn-primary">
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
