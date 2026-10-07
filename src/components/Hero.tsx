import React from 'react';
import { ArrowDown, Crown, ShieldAlert, Sparkles, Zap } from 'lucide-react';
import type { Contestant, HouseStats } from '../types/bigboss';

interface HeroProps {
  stats: HouseStats;
  captain: Contestant | undefined;
  onJumpToHousemates: () => void;
  onJumpToDangerZone: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  stats,
  captain,
  onJumpToHousemates,
  onJumpToDangerZone,
}) => {
  return (
    <section className="relative pt-6 pb-12 sm:pb-16 overflow-hidden">
      {/* Editorial Header Block */}
      <div className="max-w-4xl mx-auto text-center space-y-6">
        
        {/* Floating Top Pill Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffffff] border border-[#dcdcd3] shadow-sm text-xs font-semibold text-[#0d0e10]">
          <span className="w-2 h-2 rounded-full bg-[#d4ff3a]"></span>
          <span className="font-mono text-[11px] uppercase tracking-wider">OFFICIAL REALITY OPERATIONS</span>
          <span className="text-[#a4a59d]">•</span>
          <span className="text-[#75766f]">WEEK 3 SURVEILLANCE</span>
        </div>

        {/* Oversized Headline with Lime Highlight */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#0d0e10] leading-[1.02]">
          Total Command. <br className="hidden sm:inline" />
          <span className="inline-block relative mt-1 sm:mt-0">
            <span className="relative z-10 px-3 py-1 rounded-2xl bg-[#d4ff3a] text-[#0d0e10]">
              Zero Hesitation.
            </span>
          </span>
        </h1>

        {/* Editorial Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-[#75766f] max-w-2xl mx-auto leading-relaxed">
          The central executive terminal for Big Boss House governance. Monitor 10 housemates, execute real-time scoring decrees, issue nominations, and enforce irreversible evictions.
        </p>

        {/* Primary and Secondary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onJumpToHousemates}
            className="framer-lime-btn px-7 py-3.5 text-sm font-black flex items-center gap-2 shadow-sm"
          >
            <span>Command Housemates</span>
            <ArrowDown className="w-4 h-4" />
          </button>

          <button
            onClick={onJumpToDangerZone}
            className="px-7 py-3.5 rounded-full bg-[#0d0e10] hover:bg-[#1a1c21] text-[#ffffff] text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
          >
            <ShieldAlert className="w-4 h-4 text-[#d4ff3a]" />
            <span>View Danger Zone ({stats.nominatedCount})</span>
          </button>
        </div>

      </div>

      {/* Layered Floating Telemetry Composition */}
      <div className="mt-10 sm:mt-14 max-w-6xl mx-auto relative">
        <div className="rounded-3xl border border-[#dcdcd3] bg-[#ffffff] p-5 sm:p-7 shadow-[0_16px_50px_-10px_rgba(13,14,16,0.06)] relative overflow-hidden">
          
          {/* Subtle background radial accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4ff3a]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-[#eeeee8]">
            
            {/* Metric 1 */}
            <div className="p-3 text-center sm:text-left">
              <span className="text-[11px] font-mono uppercase text-[#75766f] tracking-wider block">
                Active In House
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-[#0d0e10] mt-1">
                {stats.activeCount} <span className="text-sm font-sans font-semibold text-[#75766f]">/ 10</span>
              </div>
              <span className="text-xs text-[#75766f] mt-1 block">
                {stats.evictedCount} permanently eliminated
              </span>
            </div>

            {/* Metric 2 */}
            <div className="p-3 pt-4 md:pt-3 text-center sm:text-left md:pl-6">
              <span className="text-[11px] font-mono uppercase text-[#75766f] tracking-wider block">
                Reigning Captain
              </span>
              <div className="text-xl sm:text-2xl font-black text-[#0d0e10] mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                <Crown className="w-5 h-5 text-[#d4ff3a] fill-[#d4ff3a] shrink-0" />
                <span className="truncate">{captain ? captain.name : 'Vacant'}</span>
              </div>
              <span className="text-xs text-[#75766f] mt-1 block font-mono">
                {captain ? `${captain.points} PTS • Immune` : 'Unassigned'}
              </span>
            </div>

            {/* Metric 3 */}
            <div className="p-3 pt-4 md:pt-3 text-center sm:text-left md:pl-6">
              <span className="text-[11px] font-mono uppercase text-[#75766f] tracking-wider block">
                Danger Zone
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-[#0d0e10] mt-1 flex items-center justify-center sm:justify-start gap-2">
                <span>{stats.nominatedCount}</span>
                <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  NOMINATED
                </span>
              </div>
              <span className="text-xs text-[#75766f] mt-1 block">
                Vulnerable to eviction
              </span>
            </div>

            {/* Metric 4 */}
            <div className="p-3 pt-4 md:pt-3 text-center sm:text-left md:pl-6">
              <span className="text-[11px] font-mono uppercase text-[#75766f] tracking-wider block">
                Total House Score
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-[#0d0e10] mt-1">
                {stats.totalPoints}
              </div>
              <span className="text-xs text-[#75766f] mt-1 block">
                Leader: <strong className="text-[#0d0e10] font-semibold">{stats.highestScorer?.name || 'N/A'}</strong>
              </span>
            </div>

          </div>

          {/* Floating Pill Highlights Row */}
          <div className="mt-5 pt-4 border-t border-[#eeeee8] flex flex-wrap items-center justify-between gap-3 text-xs text-[#75766f]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4f4ee] text-[#0d0e10] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#a1c914]" />
                Automated Tie-Break Leaderboard
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4f4ee] text-[#0d0e10] font-semibold">
                <Zap className="w-3.5 h-3.5 text-[#a1c914]" />
                Zero-Latency State Synchronization
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>All Systems Nominal</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
