import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, AlertCircle, Info, Sparkles } from 'lucide-react';

export default function Toast() {
  const { toast } = useApp();

  if (!toast.show) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />;
      case 'gold':
        return <Sparkles className="w-5 h-5 text-amber-300 flex-shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-sky-400 flex-shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in flex items-center gap-3 px-5 py-3.5 rounded-full bg-zinc-900/95 border border-amber-400/30 text-zinc-100 shadow-2xl backdrop-blur-xl max-w-md">
      {getIcon()}
      <span className="text-sm font-medium tracking-wide">{toast.message}</span>
    </div>
  );
}
