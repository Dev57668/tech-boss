import React from 'react';
import { AlertOctagon, ShieldCheck, UserX, Skull } from 'lucide-react';
import type { Contestant } from '../types/bigboss';

interface DangerZoneProps {
  nominees: Contestant[];
  onSaveWithImmunity: (contestantId: string) => void;
  onRequestEvict: (contestant: Contestant) => void;
}

export const DangerZone: React.FC<DangerZoneProps> = ({
  nominees,
  onSaveWithImmunity,
  onRequestEvict,
}) => {
  return (
    <section 
      aria-label="House Danger Zone and Eviction Nominations"
      className="relative overflow-hidden rounded-2xl border border-rose-900/60 bg-gradient-to-br from-rose-950/25 via-zinc-950/90 to-[#12080a] p-5 lg:p-6 backdrop-blur-xl shadow-[0_0_35px_rgba(244,63,94,0.1)]"
    >
      {/* Red ambient warning background */}
      <div className="absolute -bottom-24 -left-24 w-60 h-60 rounded-full bg-rose-600/10 blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-rose-900/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-600/50 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse">
            <Skull className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-black text-lg sm:text-xl tracking-wider text-white uppercase">
                DANGER ZONE • NOMINATIONS
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-950 border border-rose-700/60 text-rose-300">
                {nominees.length} AT RISK
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Contestants on the eviction chopping block this week. Grant immunity to save or execute eviction.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-rose-400/80">
          <AlertOctagon className="w-4 h-4 animate-spin text-rose-500" />
          <span className="uppercase tracking-widest text-[11px] font-bold">PUBLIC VOTING ACTIVE</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {nominees.length === 0 ? (
          /* Empty State for Nominees */
          <div className="py-7 px-4 rounded-xl border border-dashed border-rose-950 bg-zinc-950/40 text-center flex flex-col items-center justify-center">
            <div className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h4 className="text-sm font-bold text-zinc-200">Danger Zone Is Clear</h4>
            <p className="text-xs text-zinc-400 max-w-md mt-1">
              No housemates are currently facing eviction nomination. The house is temporarily at peace.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {nominees.map((c) => (
              <div
                key={c.id}
                className="relative overflow-hidden rounded-xl border border-rose-800/60 bg-zinc-900/90 p-4 shadow-lg hover:border-rose-500 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-heading text-base font-black text-white shadow-md bg-gradient-to-br ${c.avatarColor}`}>
                      {c.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-white">{c.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                          {c.team}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] text-rose-400 font-bold uppercase mt-0.5">
                        <AlertOctagon className="w-3 h-3" />
                        Nominated for Eviction
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-sm font-black text-white">{c.points}</div>
                    <div className="text-[9px] text-zinc-500 font-mono">PTS</div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSaveWithImmunity(c.id)}
                    title="Grant Immunity and remove from Danger Zone"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-600/50 text-cyan-300 text-xs font-bold transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Save (Shield)</span>
                  </button>

                  <button
                    onClick={() => onRequestEvict(c)}
                    title="Proceed with eviction"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-950/70 hover:bg-red-900 border border-red-600/70 text-red-200 text-xs font-black transition-all active:scale-95 shadow-[0_0_12px_rgba(220,38,38,0.3)] focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Evict Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
