import React, { useState } from 'react';
import { Scale, CheckCircle2, FileCheck, ShieldCheck, Lock, User, KeyRound, Building2 } from 'lucide-react';

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('anita.sharma@lab.gov.in');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({
      name: 'Anita Sharma',
      role: 'Lab Technician',
      email: username,
      avatar: '👩‍🔬'
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-100 font-sans">
      
      {/* Left Dark Hero Section */}
      <div className="w-full md:w-5/12 bg-[#0d1b2a] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
        {/* Background glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Brand */}
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Smart<span className="text-blue-400">NAWI</span>
              </div>
              <div className="text-[11px] text-slate-400 tracking-wider uppercase font-medium">
                Test. Verify. Certify.
              </div>
            </div>
          </div>

          <div className="pt-8 space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 leading-snug">
              Digital Test Report Generation for Non-Automatic Weighing Instruments as per OIML R-76
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standardized, rule-driven, and auditable digital compliance workflow for Legal Metrology testing laboratories across India.
            </p>
          </div>
        </div>

        {/* 3 Bottom Feature Icons */}
        <div className="grid grid-cols-3 gap-4 pt-12 border-t border-slate-800 text-center relative z-10">
          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-full bg-slate-800/80 mx-auto flex items-center justify-center text-blue-400">
              <Scale className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-semibold text-slate-300">Accurate Testing</div>
          </div>

          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-full bg-slate-800/80 mx-auto flex items-center justify-center text-blue-400">
              <FileCheck className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-semibold text-slate-300">Standardized Reports</div>
          </div>

          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-full bg-slate-800/80 mx-auto flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-semibold text-slate-300">Trusted Compliance</div>
          </div>
        </div>

      </div>

      {/* Right Login Form */}
      <div className="w-full md:w-7/12 flex items-center justify-center p-6 md:p-12">
        <div className="max-w-md w-full bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
          
          <div>
            <h2 className="text-xl font-bold text-slate-900">Welcome Back</h2>
            <p className="text-xs text-slate-500 mt-0.5">Login to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Username</label>
              <input
                type="text"
                required
                placeholder="Enter your username"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                placeholder="Enter your password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <a href="#forgot" className="text-xs text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="w-full btn-primary py-2.5 text-sm font-semibold">
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-semibold absolute">
              OR
            </span>
          </div>

          {/* Govt SSO Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-semibold transition-colors"
          >
            <Building2 className="w-4 h-4 text-slate-600" />
            <span>Login with Govt. SSO</span>
          </button>

          {/* Govt Footer */}
          <div className="text-center pt-4 border-t border-slate-100 space-y-1">
            <div className="text-[11px] font-semibold text-slate-600">
              Department of Consumer Affairs
            </div>
            <div className="text-[10px] text-slate-400">
              Ministry of Consumer Affairs, Food & Public Distribution • Government of India
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
