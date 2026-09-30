import React, { useState } from 'react';
import { ChevronRight, Calendar, Upload } from 'lucide-react';

export default function RegisterInstrument({ onCancel, onSave }) {
  const [formData, setFormData] = useState({
    instrumentType: 'Weighing Machine (NAWI)',
    manufacturer: 'ABC Weighing Pvt. Ltd.',
    model: 'ABC-1000',
    serialNumber: 'SN1234567',
    manufacturingYear: '2024',
    accuracyClass: 'III',
    maxCapacity: '1000',
    minCapacity: '20',
    scaleInterval: '0.2',
    capacityUnit: 'kg',
    category: 'Single-Interval',
    intendedUse: 'Trade'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="space-y-4">
      
      {/* Breadcrumb */}
      <div className="breadcrumb-text">
        <span className="text-blue-600 cursor-pointer" onClick={onCancel}>Instruments</span>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="active">Register New Instrument</span>
      </div>

      {/* Main Form Card */}
      <div className="ui-card p-6 space-y-6">
        <h1 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Register New Instrument
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Basic Information */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Instrument Type *</label>
                <select 
                  className="form-control"
                  value={formData.instrumentType}
                  onChange={(e) => setFormData({ ...formData, instrumentType: e.target.value })}
                >
                  <option value="Weighing Machine (NAWI)">Weighing Machine (NAWI)</option>
                  <option value="Precision Laboratory Balance">Precision Laboratory Balance</option>
                  <option value="Industrial Weighbridge">Industrial Weighbridge</option>
                </select>
              </div>

              <div>
                <label className="form-label">Manufacturer *</label>
                <input 
                  type="text" 
                  required 
                  className="form-control"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Model *</label>
                <input 
                  type="text" 
                  required 
                  className="form-control"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Serial Number *</label>
                <input 
                  type="text" 
                  required 
                  className="form-control"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Year of Manufacture *</label>
                <div className="relative">
                  <input 
                    type="number" 
                    required 
                    className="form-control"
                    value={formData.manufacturingYear}
                    onChange={(e) => setFormData({ ...formData, manufacturingYear: e.target.value })}
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Metrological Characteristics */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Metrological Characteristics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="form-label">Accuracy Class *</label>
                <select 
                  className="form-control"
                  value={formData.accuracyClass}
                  onChange={(e) => setFormData({ ...formData, accuracyClass: e.target.value })}
                >
                  <option value="I">I (Special)</option>
                  <option value="II">II (High)</option>
                  <option value="III">III (Medium)</option>
                  <option value="IIII">IIII (Ordinary)</option>
                </select>
              </div>

              <div>
                <label className="form-label">Maximum Capacity (Max) *</label>
                <div className="flex gap-1.5">
                  <input 
                    type="number" 
                    step="any"
                    required 
                    className="form-control"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                  />
                  <span className="px-2.5 py-1.5 bg-slate-100 border border-slate-300 rounded text-xs text-slate-600 font-medium">kg</span>
                </div>
              </div>

              <div>
                <label className="form-label">Minimum Capacity (Min) *</label>
                <div className="flex gap-1.5">
                  <input 
                    type="number" 
                    step="any"
                    required 
                    className="form-control"
                    value={formData.minCapacity}
                    onChange={(e) => setFormData({ ...formData, minCapacity: e.target.value })}
                  />
                  <span className="px-2.5 py-1.5 bg-slate-100 border border-slate-300 rounded text-xs text-slate-600 font-medium">kg</span>
                </div>
              </div>

              <div>
                <label className="form-label">Verification Scale Interval (e) *</label>
                <div className="flex gap-1.5">
                  <input 
                    type="number" 
                    step="any"
                    required 
                    className="form-control"
                    value={formData.scaleInterval}
                    onChange={(e) => setFormData({ ...formData, scaleInterval: e.target.value })}
                  />
                  <span className="px-2.5 py-1.5 bg-slate-100 border border-slate-300 rounded text-xs text-slate-600 font-medium">kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Additional Information */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Additional Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Instrument Category</label>
                <select 
                  className="form-control"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Single-Interval">Single-Interval</option>
                  <option value="Multi-Interval">Multi-Interval</option>
                  <option value="Multiple Range">Multiple Range</option>
                </select>
              </div>

              <div>
                <label className="form-label">Intended Use</label>
                <select 
                  className="form-control"
                  value={formData.intendedUse}
                  onChange={(e) => setFormData({ ...formData, intendedUse: e.target.value })}
                >
                  <option value="Trade">Trade</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Scientific">Scientific</option>
                </select>
              </div>

              <div>
                <label className="form-label">Photo (optional)</label>
                <div className="flex items-center gap-2">
                  <label className="btn-secondary text-xs cursor-pointer py-1.5 px-3">
                    <span>Choose File</span>
                    <input type="file" className="hidden" />
                  </label>
                  <span className="text-xs text-slate-400">No file chosen</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Instrument
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
