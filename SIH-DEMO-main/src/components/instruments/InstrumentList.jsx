import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Search, 
  Scale, 
  CheckCircle2, 
  Info, 
  FileText,
  Calendar,
  Building,
  Tag,
  Hash
} from 'lucide-react';
import { ACCURACY_CLASSES } from '../../core/ruleEngine';
import { logAuditAction } from '../../core/mockStore';

export default function InstrumentList({ store, currentUser, onSelectInstrumentForTest }) {
  const { instruments = [], labs = [] } = store;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for new instrument
  const [newInst, setNewInst] = useState({
    model: '',
    serialNumber: '',
    manufacturer: '',
    instrumentClass: 'CLASS_III',
    capacity: 30,
    unit: 'kg',
    scaleInterval: 0.01,
    actualInterval: 0.001,
    minCapacity: 0.2,
    tareMax: 10,
    labId: labs[0]?.id || 'LAB-DEL-01',
    deviceType: 'Electronic Bench Scale',
    manufacturingYear: 2026,
    approvedModelNumber: ''
  });

  const filteredInstruments = instruments.filter(inst => {
    const matchSearch = (
      inst.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchClass = selectedClass === 'ALL' || inst.instrumentClass === selectedClass;
    return matchSearch && matchClass;
  });

  const handleSaveInstrument = (e) => {
    e.preventDefault();
    const capacityNum = parseFloat(newInst.capacity) || 0;
    const scaleIntNum = parseFloat(newInst.scaleInterval) || 1;
    const n = scaleIntNum > 0 ? Math.round(capacityNum / scaleIntNum) : 0;

    const instrument = {
      id: `INST-2026-${Math.floor(100 + Math.random() * 900)}`,
      ...newInst,
      capacity: capacityNum,
      scaleInterval: scaleIntNum,
      actualInterval: parseFloat(newInst.actualInterval) || (scaleIntNum / 10),
      minCapacity: parseFloat(newInst.minCapacity) || (scaleIntNum * 20),
      tareMax: parseFloat(newInst.tareMax) || capacityNum,
      verificationScaleIntervals: n,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    store.instruments.unshift(instrument);
    logAuditAction(store, {
      action: 'INSTRUMENT_REGISTERED',
      category: 'REGISTRY',
      details: `Registered new instrument ${instrument.model} (${instrument.serialNumber}) with capacity ${instrument.capacity} ${instrument.unit}`,
      user: currentUser
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-cyan">Registry Module</span>
            <span className="text-xs text-slate-400 font-mono">{instruments.length} Total Devices</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Registered Non-Automatic Weighing Instruments (NAWI)
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Centralized registry of weighing instruments for type-evaluation, calibration, and legal certification under DoCA.
          </p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary self-start sm:self-auto text-sm px-4 py-2.5"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Instrument</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="glass-panel p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search by model, serial no, maker..." 
            className="form-input pl-9 text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-400">Class:</span>
          {['ALL', 'CLASS_I', 'CLASS_II', 'CLASS_III', 'CLASS_IV'].map(cls => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedClass === cls
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cls === 'ALL' ? 'All Classes' : cls.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Instruments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredInstruments.map(inst => {
          const lab = labs.find(l => l.id === inst.labId);
          const clsConfig = ACCURACY_CLASSES[inst.instrumentClass] || ACCURACY_CLASSES.CLASS_III;

          return (
            <div key={inst.id} className="glass-panel p-5 space-y-4 hover:border-cyan-500/40 transition-all">
              
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400 border border-slate-700">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base leading-snug">{inst.model}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                      <span>SN: {inst.serialNumber}</span>
                      <span>•</span>
                      <span className="text-cyan-400 font-sans">{inst.manufacturer}</span>
                    </div>
                  </div>
                </div>

                <span className="badge badge-purple text-[10px]">
                  {clsConfig.symbol} • {inst.instrumentClass?.replace('CLASS_', 'Class ')}
                </span>
              </div>

              {/* Technical Specifications Matrix */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-900/80 rounded-xl border border-slate-800/80 text-xs font-mono">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Max Capacity</div>
                  <div className="font-bold text-white">{inst.capacity} {inst.unit}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Scale Interval (e)</div>
                  <div className="font-bold text-cyan-300">{inst.scaleInterval} {inst.unit}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Intervals (n)</div>
                  <div className="font-bold text-slate-200">{inst.verificationScaleIntervals?.toLocaleString()}</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
                <div className="flex items-center gap-1.5 text-slate-300 truncate max-w-[220px]">
                  <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{lab?.name || 'DoCA Testing Center'}</span>
                </div>

                <button 
                  onClick={() => onSelectInstrumentForTest(inst)}
                  className="btn-primary text-xs px-3 py-1.5"
                >
                  <span>Evaluate This NAWI</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Instrument Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-content p-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-cyan-400" />
                Register Non-Automatic Weighing Instrument (NAWI)
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveInstrument} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Instrument Model Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Mettler Toledo JE-500" 
                    className="form-input"
                    value={newInst.model}
                    onChange={(e) => setNewInst({ ...newInst, model: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">Serial Number</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. SN-99812-IN" 
                    className="form-input font-mono"
                    value={newInst.serialNumber}
                    onChange={(e) => setNewInst({ ...newInst, serialNumber: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">Manufacturer Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Sartorius India Pvt Ltd" 
                    className="form-input"
                    value={newInst.manufacturer}
                    onChange={(e) => setNewInst({ ...newInst, manufacturer: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">OIML Accuracy Class</label>
                  <select 
                    className="form-input"
                    value={newInst.instrumentClass}
                    onChange={(e) => setNewInst({ ...newInst, instrumentClass: e.target.value })}
                  >
                    <option value="CLASS_I">Class I (Special Accuracy - Microbalance)</option>
                    <option value="CLASS_II">Class II (High Accuracy - Precision/Jewelry)</option>
                    <option value="CLASS_III">Class III (Medium Accuracy - Commercial Bench/POS)</option>
                    <option value="CLASS_IV">Class IV (Ordinary Accuracy - Industrial Weighbridge)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Max Capacity (Max)</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      step="any"
                      required 
                      className="form-input font-mono"
                      value={newInst.capacity}
                      onChange={(e) => setNewInst({ ...newInst, capacity: e.target.value })}
                    />
                    <select 
                      className="bg-slate-900 border border-slate-700 rounded px-2 text-xs text-white"
                      value={newInst.unit}
                      onChange={(e) => setNewInst({ ...newInst, unit: e.target.value })}
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="mg">mg</option>
                      <option value="ton">ton</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">Verification Scale Interval (e)</label>
                  <input 
                    type="number" 
                    step="any"
                    required 
                    className="form-input font-mono"
                    value={newInst.scaleInterval}
                    onChange={(e) => setNewInst({ ...newInst, scaleInterval: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">Actual Scale Interval (d)</label>
                  <input 
                    type="number" 
                    step="any"
                    className="form-input font-mono"
                    value={newInst.actualInterval}
                    onChange={(e) => setNewInst({ ...newInst, actualInterval: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">Approved Model No / Pattern Ref</label>
                  <input 
                    type="text" 
                    placeholder="e.g. IND-DOCA-2026-99" 
                    className="form-input font-mono"
                    value={newInst.approvedModelNumber}
                    onChange={(e) => setNewInst({ ...newInst, approvedModelNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save & Register Instrument</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
