import React from 'react';
import { Eye, ArrowUp, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 pb-12 px-4 max-w-7xl mx-auto w-full">
      <div className="rounded-3xl border border-[#23252a] bg-[#0d0e10] text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl">
        
        {/* Subtle Lime glow in background */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#d4ff3a]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-[#23252a]">
          {/* Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#16181c] border border-[#2b2e35] flex items-center justify-center text-[#d4ff3a]">
                <Eye className="w-5 h-5" />
              </div>
              <span className="font-heading font-black text-2xl tracking-tight text-white uppercase flex items-center gap-2">
                BIG BOSS
                <span className="w-2 h-2 rounded-full bg-[#d4ff3a]"></span>
              </span>
            </div>
            <p className="text-xs text-[#a0a299] max-w-sm">
              The definitive reality house surveillance & scoring command engine. Engineered for executive control and real-time governance.
            </p>
          </div>

          {/* Quick links & Back to top */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a href="#section-overview" className="text-xs font-bold text-[#a0a299] hover:text-white transition-colors">
              Overview
            </a>
            <a href="#section-housemates" className="text-xs font-bold text-[#a0a299] hover:text-white transition-colors">
              Housemates
            </a>
            <a href="#section-leaderboard" className="text-xs font-bold text-[#a0a299] hover:text-white transition-colors">
              Leaderboard
            </a>
            <a href="#section-tasks" className="text-xs font-bold text-[#a0a299] hover:text-white transition-colors">
              Tasks
            </a>
            <a href="#section-danger" className="text-xs font-bold text-[#a0a299] hover:text-white transition-colors">
              Danger Zone
            </a>

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-full bg-[#16181c] hover:bg-[#202228] border border-[#2b2e35] text-[#d4ff3a] transition-all ml-2"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="relative z-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#75766f]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#d4ff3a]" />
            <span>EXECUTIVE COMMAND HQ • SEASON 18 OPERATIONS</span>
          </div>

          <div>
            <span>Local State Engine • Resilient LocalStorage Sync</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
