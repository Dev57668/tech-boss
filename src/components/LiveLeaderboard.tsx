import React from 'react';
import { Trophy, Medal, Crown, TrendingUp, Users } from 'lucide-react';
import type { Contestant } from '../types/bigboss';

interface LiveLeaderboardProps {
  contestants: Contestant[];
  onSelectContestant?: (contestant: Contestant) => void;
}

export const LiveLeaderboard: React.FC<LiveLeaderboardProps> = ({
  contestants,
  onSelectContestant,
}) => {
  // REQUIREMENT: Only active contestants appear on Live Leaderboard!
  const activeContestants = contestants.filter((c) => c.status === 'Active');

  // Stable sort descending by points, break ties by contestant name
  const sorted = [...activeContestants].sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    return a.name.localeCompare(b.name);
  });

  // REQUIREMENT: Ties on the leaderboard (stable ordering, SAME rank shown)
  const ranked = sorted.map((c) => {
    const firstIndex = sorted.findIndex((item) => item.points === c.points);
    return {
      ...c,
      displayRank: firstIndex + 1,
    };
  });

  const leaderPoints = ranked[0]?.points || 1;

  return (
    <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/70 p-4 sm:p-5 backdrop-blur-xl shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="font-heading font-black text-base tracking-wide text-white uppercase flex items-center gap-2">
              LIVE LEADERBOARD
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/40">
                ACTIVE ONLY
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400">Ranks dynamically recalculate in real-time</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
          <TrendingUp className="w-3.5 h-3.5 text-red-500" />
          <span>{ranked.length} IN HOUSE</span>
        </div>
      </div>

      {/* Leaderboard Table / List */}
      <div className="space-y-2 overflow-y-auto pr-1 flex-1 max-h-[580px]">
        {ranked.length === 0 ? (
          <div className="py-12 px-4 rounded-xl border border-dashed border-zinc-800 text-center flex flex-col items-center justify-center">
            <Users className="w-6 h-6 text-zinc-600 mb-2" />
            <h4 className="text-xs font-bold text-zinc-400">No Active Contestants</h4>
            <p className="text-[11px] text-zinc-600 mt-0.5">All contestants are currently outside the house.</p>
          </div>
        ) : (
          ranked.map((c) => {
            const rank = c.displayRank;
            const isTop3 = rank <= 3;

            // Rank styling
            let rankBadge = (
              <span className="w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs bg-zinc-800 text-zinc-400">
                #{rank}
              </span>
            );

            let rowBg = 'bg-zinc-900/50 hover:bg-zinc-800/60 border-zinc-800/80';
            let borderHighlight = '';

            if (rank === 1) {
              rankBadge = (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-black font-black text-xs shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                  <Crown className="w-4 h-4 fill-black" />
                </div>
              );
              rowBg = 'bg-gradient-to-r from-amber-950/30 via-zinc-900/70 to-zinc-900/50 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.08)]';
              borderHighlight = 'border-l-4 border-l-amber-400';
            } else if (rank === 2) {
              rankBadge = (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-200 to-zinc-400 flex items-center justify-center text-black font-black text-xs shadow-[0_0_10px_rgba(226,232,240,0.3)]">
                  <Medal className="w-4 h-4" />
                </div>
              );
              rowBg = 'bg-zinc-900/70 border-slate-700/50';
              borderHighlight = 'border-l-4 border-l-slate-300';
            } else if (rank === 3) {
              rankBadge = (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-700 to-orange-800 flex items-center justify-center text-amber-100 font-black text-xs shadow-[0_0_10px_rgba(180,83,9,0.3)]">
                  <Medal className="w-4 h-4" />
                </div>
              );
              rowBg = 'bg-zinc-900/70 border-amber-900/40';
              borderHighlight = 'border-l-4 border-l-amber-700';
            }

            // Percentage of leader for subtle progress bar
            const progressPct = Math.max(5, Math.min(100, Math.round((c.points / (leaderPoints || 1)) * 100)));

            return (
              <div
                key={c.id}
                onClick={() => onSelectContestant?.(c)}
                className={`relative overflow-hidden rounded-xl border p-2.5 sm:p-3 transition-all duration-300 cursor-pointer ${rowBg} ${borderHighlight} group focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none`}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSelectContestant?.(c);
                }}
              >
                {/* Subtle background progress bar */}
                <div
                  className={`absolute left-0 bottom-0 top-0 opacity-10 pointer-events-none transition-all duration-500 ${
                    rank === 1 ? 'bg-amber-400' : isTop3 ? 'bg-zinc-300' : 'bg-red-500'
                  }`}
                  style={{ width: `${progressPct}%` }}
                ></div>

                <div className="relative z-10 flex items-center justify-between gap-3">
                  {/* Left: Rank & Contestant Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0">{rankBadge}</div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm tracking-tight text-white truncate">
                          {c.name}
                        </span>
                        
                        {/* Captain Badge */}
                        {c.isCaptain && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[9px] font-extrabold uppercase">
                            <Crown className="w-2.5 h-2.5 fill-amber-400" />
                            CAPTAIN
                          </span>
                        )}

                        {/* Immune badge */}
                        {c.isImmune && !c.isCaptain && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[9px] font-bold">
                            IMMUNE
                          </span>
                        )}

                        {/* Nominated badge */}
                        {c.isNominated && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px] font-bold animate-pulse">
                            NOM
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                        <span className={`font-semibold ${c.team === 'Tigers' ? 'text-amber-500' : 'text-indigo-400'}`}>
                          Team {c.team}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-zinc-500">Rank #{rank}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Points */}
                  <div className="text-right shrink-0">
                    <div className={`font-mono text-base sm:text-lg font-black tracking-tight ${
                      rank === 1 ? 'text-amber-300' : isTop3 ? 'text-zinc-100' : 'text-zinc-300'
                    }`}>
                      {c.points}
                      <span className="text-[10px] text-zinc-500 font-sans font-semibold ml-1">PTS</span>
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">
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
