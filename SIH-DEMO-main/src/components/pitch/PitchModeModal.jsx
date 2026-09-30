import React, { useState } from 'react';
import { 
  Presentation, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  FileText, 
  TrendingUp,
  Award,
  Play
} from 'lucide-react';

export default function PitchModeModal({ onClose, onJumpToTab, onLoadScenario }) {
  const [currentSlide, setCurrentSlide] = useState(1);

  const SLIDES = [
    {
      number: 1,
      title: 'Slide 1 — Problem Statement & Introduction',
      subtitle: 'Problem Statement 26035: Test Report Generation for NAWI as per OIML R-76',
      speakerScript: `“Good morning respected judges and everyone here. Imagine a weighing instrument being tested for legal certification. A single calculation error, a wrongly entered value, or an inconsistent report format can delay the entire certification process. This is exactly the problem we are addressing with SmartNAWI: transforming manual testing and reporting into a standardized, validated and traceable digital workflow.”`,
      keyTakeaways: [
        'Problem Statement 26035 under Dept. of Consumer Affairs (DoCA)',
        'Legal Metrology Act, 2009 & OIML R-76 Compliance',
        'Standardized digital workflow replacing manual spreadsheets and paper records'
      ],
      actionLabel: 'Explore Dashboard',
      targetTab: 'dashboard'
    },
    {
      number: 2,
      title: 'Slide 2 — Problem & Proposed Solution',
      subtitle: 'Eliminating Human Error via Deterministic Regulatory Rules',
      speakerScript: `“Currently, much of the workflow involves paper records or spreadsheets, manual permissible-error calculations, and manually prepared reports. This creates three major problems: human calculation errors, inconsistent reporting, and unnecessary delays. SmartNAWI automates this entire process with a configurable rule engine that adapts as regulatory standards evolve without rewriting the application.”`,
      keyTakeaways: [
        'Configurable Rule Engine: OIML R-76-1:2006 & Legal Metrology Rules 2011',
        'Zero Calculation Errors: Deterministic Maximum Permissible Error (MPE) engine',
        'Turnaround Time Reduction: Days down to minutes'
      ],
      actionLabel: 'Inspect Rule Engine Architecture',
      targetTab: 'rules'
    },
    {
      number: 3,
      title: 'Slide 3 — 6-Step Automated Workflow (Core Innovation)',
      subtitle: 'Point through the 6 steps that turn raw data into certified reports',
      speakerScript: `“First, authorized user logs in via RBAC. Second, enters instrument & environmental data. Third, records OIML R-76 test observations. Fourth, SmartNAWI validates data and calculates permissible error. Fifth, the system applies pass/fail logic. Sixth, generates the standardized report with cryptographic audit trail.”`,
      keyTakeaways: [
        '1. Secure Login & RBAC (Technician, Approver, Admin, Verifier)',
        '2. Instrument Metadata Capture (Max, Min, e, d, Accuracy Class I–IV)',
        '3. Test Observations Entry (Performance, Repeatability, Eccentricity)',
        '4. Deterministic MPE & Error Calculation (Ec = E - E0)',
        '5. Automated PASS/FAIL Compliance Verdict',
        '6. Standardized PDF Certificate with SHA-256 Hash & QR Code'
      ],
      actionLabel: 'Launch 1-Click Pass Demo',
      scenarioToLoad: 'PERFECT_PASS'
    },
    {
      number: 4,
      title: 'Slide 4 — Technical Approach & Architecture',
      subtitle: 'Robust, Modular, and Cryptographically Tamper-Evident',
      speakerScript: `“From a technical perspective, we have deliberately chosen a reliable architecture. The frontend is built using React.js with modular REST APIs. We divide the system into independent modules: Data Capture, OIML Validation Engine, Report Engine, and Immutable Audit Repository. Real-time range checks prevent data-entry errors while SHA-256 digital signatures protect reports from tampering.”`,
      keyTakeaways: [
        'Modular Components: UI, Deterministic Engine, Report Engine, Cryptographic Ledger',
        'Cryptographic Tamper-Evidence: SHA-256 digital signatures & Public QR verification',
        'Role-Based Access Control (RBAC): Technician creation -> Officer Approval'
      ],
      actionLabel: 'Test Tamper Verification Portal',
      targetTab: 'verification'
    },
    {
      number: 5,
      title: 'Slide 5 — 4-Dimensional Impact',
      subtitle: 'Social, Economic, Environmental, and Governance Benefits',
      speakerScript: `“Socially, we improve trust through tamper-resistant certification. Economically, we reduce preparation time and avoid costly re-tests. Environmentally, we eliminate paper by moving to digital repositories. And from a governance perspective, we enable nationally standardized OIML R-76 reports across designated laboratories.”`,
      keyTakeaways: [
        '🛡️ Social: Unforgeable trust for consumers, traders, and manufacturers',
        '💰 Economic: Drastic reduction in certification delays and test re-runs',
        '🌱 Environmental: 100% paperless digital certificates & archives',
        '🏛️ Governance: National consistency across DoCA & regional reference labs'
      ],
      actionLabel: 'View Certificate Repository',
      targetTab: 'reports'
    },
    {
      number: 6,
      title: 'Slide 6 — Closing & Live Demo',
      subtitle: 'Transforming NAWI Type-Evaluation into an Auditable Digital Workflow',
      speakerScript: `“SmartNAWI transforms NAWI type-evaluation from a manual, error-prone reporting process into a standardized, rule-driven and auditable digital workflow. That is SmartNAWI. Let us demonstrate the complete live journey with a single click!”`,
      keyTakeaways: [
        'Live Demonstration Ready: Real-time MPE calculation & PDF generation',
        'Deterministic Compliance: No guesswork or manual calculator errors',
        'Thank you respected judges!'
      ],
      actionLabel: 'Run Out-of-Tolerance Failure Test Case',
      scenarioToLoad: 'OUT_OF_TOLERANCE_FAIL'
    }
  ];

  const slide = SLIDES[currentSlide - 1];

  const handleAction = () => {
    onClose();
    if (slide.scenarioToLoad) {
      onLoadScenario(slide.scenarioToLoad);
    } else if (slide.targetTab) {
      onJumpToTab(slide.targetTab);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content p-6 max-w-3xl border-cyan-500/50 shadow-2xl shadow-cyan-500/10">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Presentation className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                SmartNAWI SIH Pitch Companion
              </span>
              <div className="text-[11px] text-slate-400">
                Interactive Presentation Deck • Slide {currentSlide} of {SLIDES.length}
              </div>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl font-bold p-1">✕</button>
        </div>

        {/* Slide Main Body */}
        <div className="my-5 space-y-5">
          
          <div>
            <span className="badge badge-cyan text-[10px]">{slide.title}</span>
            <h2 className="text-xl font-black text-white mt-1">{slide.subtitle}</h2>
          </div>

          {/* Speaker Script Box */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Speaker Pitch Script (What to say):
            </div>
            <p className="text-xs text-slate-200 leading-relaxed italic">
              {slide.speakerScript}
            </p>
          </div>

          {/* Key Bullet Points */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Key Technical & Problem-Solution Arguments:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {slide.keyTakeaways.map((item, idx) => (
                <div key={idx} className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800/80 flex items-start gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Navigation & Live Demo Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide(Math.max(1, currentSlide - 1))}
              disabled={currentSlide === 1}
              className="btn-secondary text-xs disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={() => setCurrentSlide(Math.min(SLIDES.length, currentSlide + 1))}
              disabled={currentSlide === SLIDES.length}
              className="btn-secondary text-xs disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Jump to Live Feature in App */}
          <button
            onClick={handleAction}
            className="btn-primary text-xs flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold px-4 py-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{slide.actionLabel} (Live Demo)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
