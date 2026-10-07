import React from 'react';
import { Trophy, Medal, Crown, TrendingUp, AlertOctagon, ShieldCheck } from 'lucide-react';
import type { Contestant } from '../types/bigboss';

interface LiveLeaderboardProps {
  contestants: Contestant[];
  onSelectContestant?: (contestant: Contestant) => void;
}

export const LiveLeaderboard: React.FC<LiveLeaderboardProps> = ({
  contestants,
  onSelectContestant,
}) => {
  // Exclude evicted contestants from leaderboard
  const activeContestants = contestants.filter((c) => c.status === 'Active');

  // Stable sort descending by points, break ties by contestant name
  const sorted = [...activeContestants].sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    return a.name.localeCompare(b.name);
  });

  // Calculate ranks handling ties purely (contestants with equal points share the same rank)
  const ranked = sorted.map((c) => {
    const firstIndex = sorted.findIndex((item) => item.points === c.points);
    return {
      ...c,
      displayRank: firstIndex + 1,
    };
  });

  const leaderPoints = ranked[0]?.points || 1;

  return (
    <div id="section-leaderboard" className="rounded-3xl border border-[#dcdcd3] bg-[#ffffff] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#eeeee8]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#0d0e10] text-[#d4ff3a] flex items-center justify-center">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-black text-base tracking-tight text-[#0d0e10] uppercase flex items-center gap-2">
              LIVE LEADERBOARD
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#d4ff3a] text-[#0d0e10] font-bold">
                REAL-TIME
              </span>
            </h3>
            <p className="text-xs text-[#75766f]">Active house standings ({ranked.length} Housemates)</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-[#75766f]">
          <TrendingUp className="w-3.5 h-3.5 text-[#0d0e10]" />
          <span>STANDINGS</span>
        </div>
      </div>

      {/* Leaderboard Table / List */}
      <div className="space-y-2 overflow-y-auto pr-1 flex-1 max-h-[560px]">
        {ranked.length === 0 ? (
          <div className="text-center py-12 text-[#75766f] text-xs">
            No active housemates to display.
          </div>
        ) : (
          ranked.map((c) => {
            const rank = c.displayRank;
            const isTop3 = rank <= 3;

            // Rank styling
            let rankBadge = (
              <span className="w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs bg-[#f4f4ee] text-[#0d0e10]">
                {rank}
              </span>
            );

            let rowBg = 'bg-[#ffffff] hover:bg-[#fbfbf8] border-[#e8e8df]';

            if (rank === 1) {
              rankBadge = (
                <div className="w-7 h-7 rounded-full bg-[#d4ff3a] flex items-center justify-center text-[#0d0e10] font-black text-xs shadow-sm">
                  <Crown className="w-4 h-4 fill-[#0d0e10]" />
                </div>
              );
              rowBg = 'bg-[#fcfdf7] border-[#d4ff3a] ring-1 ring-[#d4ff3a]/50 shadow-sm';
            } else if (rank === 2) {
              rankBadge = (
                <div className="w-7 h-7 rounded-full bg-[#0d0e10] flex items-center justify-center text-white font-black text-xs">
                  <Medal className="w-4 h-4" />
                </div>
              );
              rowBg = 'bg-[#ffffff] border-[#dcdcd3]';
            } else if (rank === 3) {
              rankBadge = (
                <div className="w-7 h-7 rounded-full bg-[#f4f4ee] border border-[#dcdcd3] flex items-center justify-center text-[#0d0e10] font-black text-xs">
                  <Medal className="w-4 h-4" />
                </div>
              );
              rowBg = 'bg-[#ffffff] border-[#dcdcd3]';
            }

            // Progress percentage for visual bar
            const progressPct = Math.max(5, Math.min(100, Math.round((c.points / (leaderPoints || 1)) * 100)));

            return (
              <div
                key={c.id}
                onClick={() => onSelectContestant?.(c)}
                className={`relative overflow-hidden rounded-2xl border p-3 transition-all cursor-pointer ${rowBg} group`}
              >
                {/* Subtle progress fill */}
                <div
                  className={`absolute left-0 bottom-0 top-0 opacity-15 pointer-events-none transition-all duration-500 ${
                    rank === 1 ? 'bg-[#d4ff3a]' : isTop3 ? 'bg-[#dcdcd3]' : 'bg-[#f4f4ee]'
                  }`}
                  style={{ width: `${progressPct}%` }}
                ></div>

                <div className="relative z-10 flex items-center justify-between gap-3">
                  {/* Left: Rank & Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0">{rankBadge}</div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm tracking-tight truncate text-[#0d0e10]">
                          {c.name}
                        </span>

                        {/* Captain Badge */}
                        {c.isCaptain && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#d4ff3a] text-[#0d0e10] text-[9px] font-black uppercase">
                            <Crown className="w-2.5 h-2.5 fill-[#0d0e10]" />
                            CAPTAIN
                          </span>
                        )}

                        {/* Immune badge */}
                        {c.isImmune && !c.isCaptain && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            IMMUNE
                          </span>
                        )}

                        {/* Nominated badge */}
                        {c.isNominated && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[9px] font-bold">
                            <AlertOctagon className="w-2.5 h-2.5" />
                            NOM
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#75766f] mt-0.5">
                        <span className={`font-semibold ${c.team === 'Tigers' ? 'text-amber-800' : 'text-indigo-800'}`}>
                          Team {c.team}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-[#75766f]">Rank #{rank}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Points */}
                  <div className="text-right shrink-0">
                    <div className="font-mono text-base sm:text-lg font-black text-[#0d0e10] tracking-tight">
                      {c.points}
                      <span className="text-[10px] text-[#75766f] font-sans font-semibold ml-1">PTS</span>
                    </div>
                    <div className="text-[10px] text-[#75766f] font-mono">
                      {rank === 1 ? 'Leader' : `${leaderPoints - c.points} behind`}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
