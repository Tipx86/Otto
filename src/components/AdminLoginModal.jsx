import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, KeyRound, X, ArrowRight } from 'lucide-react';

export default function AdminLoginModal({ isOpen, onClose }) {
  const { adminLogin, siteContent, navigateTo } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (adminLogin(pin)) {
      setPin('');
      setError(false);
      onClose();
      navigateTo('admin');
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md p-8 rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 text-blue-600 mb-3 shadow-sm">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
            EliteRide Admin Portal
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Enter authorized security PIN to manage vehicles, pricing, availability & website content.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Security PIN Code
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                maxLength={8}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="••••"
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-center text-xl font-mono tracking-[0.4em] font-bold focus:outline-none ${
                  error ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-200 focus:border-blue-500'
                }`}
                autoFocus
              />
            </div>
            {error && (
              <p className="text-xs text-rose-500 mt-1.5 text-center font-semibold">
                Incorrect security PIN. Please try again.
              </p>
            )}
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-otto-primary py-3 px-4 text-xs uppercase flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              <span>Unlock Admin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
