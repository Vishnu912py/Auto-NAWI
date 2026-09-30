import React from 'react';

/**
 * Interactive SVG Metrological Error Curve & MPE Tolerance Envelope
 * Renders the upper (+mpe) and lower (-mpe) statutory tolerance band
 * and plots actual test observation points with Pass/Fail color coding.
 */
export default function ToleranceChart({ evaluatedPoints = [], unit = 'kg', maxCapacity = 30 }) {
  if (!evaluatedPoints || evaluatedPoints.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-slate-500 italic bg-slate-950/60 rounded-xl border border-slate-800">
        No test observations to plot.
      </div>
    );
  }

  // Chart dimensions
  const width = 600;
  const height = 240;
  const padLeft = 60;
  const padRight = 30;
  const padTop = 30;
  const padBottom = 40;

  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  // Find max load and max error scale
  const maxLoad = Math.max(...evaluatedPoints.map(p => Number(p.appliedLoad) || 0), maxCapacity || 30, 1);
  const maxMpe = Math.max(...evaluatedPoints.map(p => Number(p.mpeLimit) || 0), 0.01);
  const maxAbsErr = Math.max(...evaluatedPoints.map(p => Math.abs(Number(p.correctedError) || 0)), maxMpe);
  const yLimit = maxAbsErr * 1.35; // 35% headroom

  const scaleX = (val) => padLeft + (val / maxLoad) * plotW;
  const scaleY = (val) => padTop + plotH / 2 - (val / yLimit) * (plotH / 2);

  // Generate MPE Envelope Polygon (Top and Bottom boundaries)
  // Sort points by load
  const sortedPoints = [...evaluatedPoints].sort((a, b) => Number(a.appliedLoad) - Number(b.appliedLoad));
  
  // Upper boundary (+mpe) path
  const upperPath = sortedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.appliedLoad)} ${scaleY(p.mpeLimit)}`).join(' ');
  // Lower boundary (-mpe) path
  const lowerPath = sortedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.appliedLoad)} ${scaleY(-p.mpeLimit)}`).join(' ');

  // Filled tolerance band polygon
  const reversedPoints = [...sortedPoints].reverse();
  const bandPolygon = sortedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.appliedLoad)} ${scaleY(p.mpeLimit)}`).join(' ') + ' ' +
    reversedPoints.map(p => `L ${scaleX(p.appliedLoad)} ${scaleY(-p.mpeLimit)}`).join(' ') + ' Z';

  return (
    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
      <div className="flex flex-wrap items-center justify-between text-xs">
        <div className="font-bold text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span>OIML R-76 Error Curve vs Statutory MPE Tolerance Envelope</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-400 inline-block" />
            <span>±MPE Boundary</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>Pass Point</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
            <span>Fail Point</span>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[500px]">
          <defs>
            <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.18" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padLeft} y1={scaleY(0)} x2={width - padRight} y2={scaleY(0)} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
          <line x1={padLeft} y1={padTop} x2={padLeft} y2={height - padBottom} stroke="#475569" strokeWidth="1" />
          <line x1={padLeft} y1={height - padBottom} x2={width - padRight} y2={height - padBottom} stroke="#475569" strokeWidth="1" />

          {/* Tolerance Band Area */}
          <path d={bandPolygon} fill="url(#bandGrad)" />

          {/* Upper & Lower MPE Lines */}
          <path d={upperPath} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />
          <path d={lowerPath} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />

          {/* Plotted Error Curve */}
          {sortedPoints.length > 1 && (
            <path
              d={sortedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.appliedLoad)} ${scaleY(p.correctedError)}`).join(' ')}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
            />
          )}

          {/* Points */}
          {sortedPoints.map((p, idx) => {
            const cx = scaleX(p.appliedLoad);
            const cy = scaleY(p.correctedError);
            const passed = p.passed;

            return (
              <g key={idx} className="cursor-pointer group">
                <circle
                  cx={cx}
                  cy={cy}
                  r="5"
                  fill={passed ? '#10b981' : '#ef4444'}
                  stroke="#0f172a"
                  strokeWidth="2"
                  className="transition-transform hover:scale-150"
                />
                <title>{`Load: ${p.appliedLoad} ${unit}\nIndication: ${p.indicatedValue} ${unit}\nError: ${p.correctedError >= 0 ? '+' : ''}${p.correctedError} ${unit}\nMPE: ±${p.mpeLimit} ${unit}\nStatus: ${passed ? 'PASS' : 'FAIL'}`}</title>
              </g>
            );
          })}

          {/* Y Axis Labels */}
          <text x={padLeft - 8} y={scaleY(yLimit * 0.8)} fill="#94a3b8" fontSize="9" textAnchor="end" fontFamily="monospace">
            +{ (yLimit * 0.8).toFixed(3) }
          </text>
          <text x={padLeft - 8} y={scaleY(0) + 3} fill="#cbd5e1" fontSize="9" textAnchor="end" fontFamily="monospace">
            0.000
          </text>
          <text x={padLeft - 8} y={scaleY(-yLimit * 0.8)} fill="#94a3b8" fontSize="9" textAnchor="end" fontFamily="monospace">
            -{ (yLimit * 0.8).toFixed(3) }
          </text>
          <text x={18} y={height / 2} fill="#64748b" fontSize="9" textAnchor="middle" transform={`rotate(-90 18 ${height / 2})`}>
            Error ({unit})
          </text>

          {/* X Axis Labels */}
          <text x={padLeft} y={height - padBottom + 16} fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">
            0
          </text>
          <text x={scaleX(maxLoad / 2)} y={height - padBottom + 16} fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">
            { (maxLoad / 2).toFixed(1) }
          </text>
          <text x={scaleX(maxLoad)} y={height - padBottom + 16} fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">
            { maxLoad.toFixed(1) }
          </text>
          <text x={padLeft + plotW / 2} y={height - 8} fill="#64748b" fontSize="9" textAnchor="middle">
            Applied Load ({unit})
          </text>
        </svg>
      </div>
    </div>
  );
}
