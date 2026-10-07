import React from 'react';
import { X, Volume2 } from 'lucide-react';

interface BigBossBannerProps {
  message: string | null;
  onDismiss: () => void;
}

export const BigBossBanner: React.FC<BigBossBannerProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div 
      role="alert"
      className="fixed top-4 left-4 right-4 z-50 max-w-5xl mx-auto bg-[#0d0e10] border border-[#26282e] text-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] px-5 py-4 backdrop-blur-2xl animate-in slide-in-from-top-4 duration-300"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: Big Boss Badge & Message */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-[#d4ff3a] text-[#0d0e10] flex items-center justify-center shrink-0 shadow-md">
            <Volume2 className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold tracking-wider text-[#d4ff3a] uppercase px-2 py-0.5 rounded-full bg-[#1b1e24] border border-[#2e323b]">
                SUPREME DECREE
              </span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4ff3a] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4ff3a]"></span>
              </span>
            </div>
            <p className="text-sm sm:text-base font-bold text-white tracking-tight mt-0.5 truncate max-w-3xl font-heading">
              "{message}"
            </p>
          </div>
        </div>

        {/* Right: Close button */}
        <button
          onClick={onDismiss}
          className="p-2 rounded-full text-[#a4a59d] hover:text-white hover:bg-[#1f2127] transition-colors shrink-0"
          title="Dismiss decree banner"
          aria-label="Dismiss decree banner"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

