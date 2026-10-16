import React, { useState } from 'react';
import { 
  RotateCcw, 
  ShieldCheck, 
  Store, 
  User, 
  ArrowRight, 
  Mail, 
  Lock, 
  Sun,
  Moon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const AuthScreen: React.FC = () => {
  const { loginUser, loginWithPassword, registerAccount, users, theme, toggleTheme, backendOnline, apiError, authBusy } = useApp();
  
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setFormError(null);
    setSubmitting(true);
    try {
      if (isSignUp) {
        await registerAccount({ name, email, password, role: selectedRole });
      } else {
        await loginWithPassword(email, password);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not sign in');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden transition-colors">
      
      {/* Decorative ambient background shapes */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Theme toggle in top right */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-md transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
        </button>
      </div>

      <div className="w-full max-w-lg z-10">
        
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-3">
            <RotateCcw className="w-4 h-4 text-indigo-500" />
            <span>Hackathon Track 06 • PS 25/35</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Fix<span className="text-indigo-500">Cycle</span> Portal Login
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Negotiating the Return Path for Repairable Electronics • Manipal University Jaipur
          </p>
          <p className={`mt-3 text-[11px] font-mono ${backendOnline ? 'text-emerald-600' : 'text-amber-600'}`}>
            {authBusy ? 'Connecting to MySQL API…' : backendOnline ? 'MySQL backend online • demo password: demo123' : `API offline${apiError ? ` (${apiError})` : ''} — using local demo data`}
          </p>
        </div>

        {/* 1-Click Fast Judge Logins Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 mb-6 shadow-2xl transition-colors">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center justify-between">
            <span>Fast 1-Click Judge Access</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">Instant Login</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => loginUser(users[0])} // Aarav Sharma (Customer)
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-indigo-500/10 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
                  AS
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Aarav Sharma</p>
                  <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">Customer (MUJ Student)</p>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">
                Access Intake, 10km Real Map & Returns
              </p>
            </button>

            <button
              onClick={() => loginUser(users[2])} // Mukesh Verma (Shopkeeper)
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-violet-500/10 border border-slate-200 dark:border-slate-800 hover:border-violet-500/40 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-violet-500/20 text-violet-700 dark:text-violet-300 flex items-center justify-center font-bold text-xs">
                  MV
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400">Mukesh Verma</p>
                  <p className="text-[10px] text-violet-600 dark:text-violet-400 font-mono">Shopkeeper (Apex Tech Depot)</p>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">
                Access Inventory, Benches & Bidding
              </p>
            </button>
          </div>
        </div>

        {/* Main Login Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl transition-colors">
          
          {/* Role selector tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => setSelectedRole('customer')}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedRole === 'customer'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Customer Portal</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('shopkeeper')}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedRole === 'shopkeeper'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Service Center</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {isSignUp && (
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={selectedRole === 'customer' ? 'student@jaipur.manipal.edu' : 'depot@apexrepair.in'}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {formError && (
              <p className="text-rose-500 text-[11px] font-medium">{formError}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer disabled:opacity-60 ${
                selectedRole === 'customer'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/20'
              }`}
            >
              <span>{submitting ? 'Please wait…' : isSignUp ? 'Create Account & Enter' : `Sign In as ${selectedRole === 'customer' ? 'Customer' : 'Service Center'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                {isSignUp ? 'Already registered? Sign in here' : "Need a new account? Register here"}
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
};
