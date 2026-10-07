import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  UserX, 
  Megaphone, 
  X 
} from 'lucide-react';
import type { ToastMessage } from '../types/bigboss';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        let borderColor = 'border-zinc-700';
        let bgColor = 'bg-zinc-900/95';
        let textColor = 'text-zinc-200';
        let icon = <Info className="w-5 h-5 text-blue-400 shrink-0" />;

        if (toast.variant === 'success') {
          borderColor = 'border-emerald-500/50';
          bgColor = 'bg-zinc-950/95';
          textColor = 'text-emerald-300';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
        } else if (toast.variant === 'error') {
          borderColor = 'border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.25)]';
          bgColor = 'bg-[#180a0d]/95';
          textColor = 'text-rose-200';
          icon = <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
        } else if (toast.variant === 'warning') {
          borderColor = 'border-amber-500/50';
          bgColor = 'bg-zinc-950/95';
          textColor = 'text-amber-200';
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
        } else if (toast.variant === 'announcement') {
          borderColor = 'border-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.25)]';
          bgColor = 'bg-[#181308]/95';
          textColor = 'text-amber-200';
          icon = <Megaphone className="w-5 h-5 text-amber-400 shrink-0" />;
        } else if (toast.variant === 'eviction') {
          borderColor = 'border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.4)] animate-pulse';
          bgColor = 'bg-gradient-to-r from-red-950 via-zinc-950 to-red-950';
          textColor = 'text-red-100';
          icon = <UserX className="w-6 h-6 text-red-500 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl border ${borderColor} ${bgColor} p-3.5 backdrop-blur-xl shadow-2xl flex items-start justify-between gap-3 transition-all duration-300 animate-in slide-in-from-top-3 fade-in`}
            role="alert"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="pt-0.5">{icon}</div>
              <div className="min-w-0">
                {toast.title && (
                  <h5 className="font-heading font-black text-xs uppercase tracking-wider text-white">
                    {toast.title}
                  </h5>
                )}
                <p className={`text-xs ${textColor} leading-snug break-words font-medium`}>
                  {toast.message}
                </p>
              </div>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors shrink-0"
              title="Dismiss notification"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
