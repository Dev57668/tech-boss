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
      className="rounded-3xl border border-[#dcdcd3] bg-[#ffffff] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#eeeee8]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#0d0e10] text-rose-500 flex items-center justify-center">
            <UserX className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-black text-base tracking-tight text-[#0d0e10] uppercase flex items-center gap-2">
              EVICTED CONTESTANTS
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                OUTSIDE HOUSE • {evictedContestants.length}
              </span>
            </h3>
            <p className="text-xs text-[#75766f]">
              Contestants eliminated from the house. All active privileges and actions permanently disabled.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-[#75766f]">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          <span>DOOR LOCKED</span>
        </div>
      </div>

      {/* Content */}
      {evictedContestants.length === 0 ? (
        /* Empty State */
        <div className="py-8 px-4 rounded-2xl border border-dashed border-[#dcdcd3] bg-[#f8f8f4] text-center flex flex-col items-center justify-center">
          <div className="p-3 rounded-full bg-[#eeeee8] text-[#75766f] mb-2">
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
          <h4 className="text-sm font-bold text-[#0d0e10]">No Contestants Evicted Yet</h4>
          <p className="text-xs text-[#75766f] max-w-sm mt-1">
            The house is currently operating at full strength. Evicted contestants will be archived here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {evictedContestants.map((c) => (
            <div
              key={c.id}
              className="relative overflow-hidden rounded-2xl border border-[#dcdcd3] bg-[#f8f8f4] p-4 opacity-80 hover:opacity-100 transition-opacity group"
            >
              {/* Corner Watermark */}
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0d0e10] text-white font-mono font-black text-[9px] uppercase tracking-wider shadow-sm">
                  <UserX className="w-2.5 h-2.5" />
                  EVICTED
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#dcdcd3] text-[#75766f] flex items-center justify-center font-heading text-base font-bold shadow-inner shrink-0">
                  {c.name.substring(0, 2).toUpperCase()}
                </div>

                <div className="min-w-0 pr-16">
                  <h4 className="font-bold text-sm text-[#75766f] line-through truncate">
                    {c.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-[#75766f] mt-0.5 font-mono">
                    <span>Team {c.team}</span>
                    <span>•</span>
                    <span className="text-[#0d0e10] font-bold">{c.points} PTS</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#e8e8df] flex items-center justify-between text-[11px] text-[#75766f] font-mono">
                <span>Final Score: {c.points} PTS</span>
                <span className="text-rose-600 font-semibold">Eliminated</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
