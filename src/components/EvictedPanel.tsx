import React from 'react';
import { UserX, ShieldAlert, Users } from 'lucide-react';
import type { Contestant } from '../types/bigboss';

interface EvictedPanelProps {
  evictedContestants: Contestant[];
}

export const EvictedPanel: React.FC<EvictedPanelProps> = ({ evictedContestants }) => {
  return (
    <section 
      aria-label="Evicted Housemates Dossier"
      className="rounded-2xl border border-zinc-800/90 bg-[#0a0a0d]/90 p-5 backdrop-blur-xl shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-zinc-400">
            <UserX className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <h3 className="font-heading font-black text-base tracking-wide text-white uppercase flex items-center gap-2">
              EVICTED CONTESTANTS
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/40">
                OUTSIDE HOUSE • {evictedContestants.length}
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400">
              Contestants eliminated from the house. All active privileges and actions permanently disabled.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500">
          <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
          <span>DOOR LOCKED</span>
        </div>
      </div>

      {/* Content */}
      {evictedContestants.length === 0 ? (
        /* Empty State */
        <div className="py-8 px-4 rounded-xl border border-dashed border-zinc-800/80 bg-zinc-950/40 text-center flex flex-col items-center justify-center">
          <div className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 mb-2">
            <Users className="w-5 h-5 text-emerald-500/70" />
          </div>
          <h4 className="text-sm font-bold text-zinc-300">No Contestants Evicted Yet</h4>
          <p className="text-xs text-zinc-500 max-w-sm mt-1">
            The house is currently operating at full strength. Evicted contestants will be archived here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {evictedContestants.map((c) => (
            <div
              key={c.id}
              className="relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/80 p-3.5 opacity-75 hover:opacity-90 transition-opacity grayscale hover:grayscale-0 group"
            >
              {/* Corner Watermark */}
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-950/90 border border-red-700/60 text-red-400 font-mono font-black text-[9px] uppercase tracking-wider shadow-sm">
                  <UserX className="w-2.5 h-2.5" />
                  EVICTED
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-zinc-800 text-zinc-400 flex items-center justify-center font-heading text-base font-bold shadow-inner shrink-0">
                  {c.name.substring(0, 2).toUpperCase()}
                </div>

                <div className="min-w-0 pr-16">
                  <h4 className="font-bold text-sm text-zinc-300 line-through truncate">
                    {c.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-0.5 font-mono">
                    <span>Team {c.team}</span>
                    <span>•</span>
                    <span className="text-amber-400/80 font-bold">{c.points} PTS</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-zinc-900/90 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span>Final House Points: {c.points}</span>
                <span className="text-red-500/80">Journey Concluded</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
