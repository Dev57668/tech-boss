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
        let borderColor = 'border-[#dcdcd3]';
        let bgColor = 'bg-[#ffffff]/95';
        let textColor = 'text-[#0d0e10]';
        let icon = <Info className="w-5 h-5 text-blue-500 shrink-0" />;

        if (toast.variant === 'success') {
          borderColor = 'border-emerald-300';
          bgColor = 'bg-[#ffffff]/95';
          textColor = 'text-emerald-900';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
        } else if (toast.variant === 'error') {
          borderColor = 'border-rose-400 shadow-[0_4px_25px_rgba(244,63,94,0.15)]';
          bgColor = 'bg-[#fff5f5]/95';
          textColor = 'text-rose-950';
          icon = <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />;
        } else if (toast.variant === 'warning') {
          borderColor = 'border-amber-300';
          bgColor = 'bg-[#fffdf5]/95';
          textColor = 'text-amber-950';
          icon = <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
        } else if (toast.variant === 'announcement') {
          borderColor = 'border-[#0d0e10] shadow-[0_4px_30px_rgba(0,0,0,0.1)]';
          bgColor = 'bg-[#0d0e10]/95';
          textColor = 'text-[#d4ff3a]';
          icon = <Megaphone className="w-5 h-5 text-[#d4ff3a] shrink-0" />;
        } else if (toast.variant === 'eviction') {
          borderColor = 'border-rose-600 shadow-[0_8px_35px_rgba(220,38,38,0.3)] animate-pulse';
          bgColor = 'bg-[#0d0e10]';
          textColor = 'text-white';
          icon = <UserX className="w-6 h-6 text-rose-500 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border ${borderColor} ${bgColor} p-4 backdrop-blur-xl shadow-xl flex items-start justify-between gap-3 transition-all duration-300 animate-in slide-in-from-top-3 fade-in`}
            role="alert"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="pt-0.5">{icon}</div>
              <div className="min-w-0">
                {toast.title && (
                  <h5 className="font-heading font-black text-xs uppercase tracking-tight text-[#0d0e10] dark:text-white">
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
              className="text-[#75766f] hover:text-[#0d0e10] p-1 rounded-full hover:bg-[#f4f4ee] transition-colors shrink-0"
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
