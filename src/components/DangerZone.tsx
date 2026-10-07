import React from 'react';
import { AlertOctagon, ShieldCheck, UserX, Shield, RotateCcw } from 'lucide-react';
import type { Contestant } from '../types/bigboss';

interface DangerZoneProps {
  nominees: Contestant[];
  onRevokeNomination?: (contestantId: string) => void;
  onRemoveNomination?: (contestantId: string) => void;
  onRequestEvict: (contestant: Contestant) => void;
  onClearAllNominations?: () => void;
}

export const DangerZone: React.FC<DangerZoneProps> = ({
  nominees,
  onRevokeNomination,
  onRemoveNomination,
  onRequestEvict,
  onClearAllNominations,
}) => {
  const handleRevoke = (id: string) => {
    if (onRemoveNomination) onRemoveNomination(id);
    else if (onRevokeNomination) onRevokeNomination(id);
  };

  return (
    <div id="section-danger" className="rounded-3xl border border-[#dcdcd3] bg-[#ffffff] p-5 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#eeeee8]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-rose-100 text-rose-700">
            <AlertOctagon className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-heading font-black text-lg tracking-tight text-[#0d0e10] uppercase flex items-center gap-2">
              DANGER ZONE — EVICTION RADAR
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                {nominees.length} IN DANGER
              </span>
            </h3>
            <p className="text-xs text-[#75766f]">Live roster of housemates currently nominated for public eviction</p>
          </div>
        </div>

        {onClearAllNominations && nominees.length > 0 && (
          <button
            onClick={onClearAllNominations}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f4f4ee] hover:bg-rose-100 hover:text-rose-800 text-[#0d0e10] text-xs font-bold transition-colors"
            title="Clear all active nominations"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Pardon All</span>
          </button>
        )}
      </div>

      {/* Nominees List or Empty State */}
      {nominees.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center rounded-2xl bg-[#f4f4ee] border border-dashed border-[#dcdcd3]">
          <Shield className="w-8 h-8 text-emerald-600 mb-2" />
          <p className="text-xs font-bold text-[#0d0e10] uppercase tracking-wider">
            Danger Zone Inactive
          </p>
          <p className="text-xs text-[#75766f] mt-0.5">
            No contestants are currently nominated. All active housemates are safe.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {nominees.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-rose-200 bg-[#fff5f5] p-4 flex items-center justify-between gap-3 group hover:border-rose-400 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-heading text-sm font-black text-white shadow-sm bg-gradient-to-br ${c.avatarColor}`}
                >
                  {c.name.substring(0, 2).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-[#0d0e10] truncate">{c.name}</span>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-800 uppercase">
                      NOMINATED
                    </span>
                  </div>
                  <div className="text-xs text-[#75766f] font-mono mt-0.5">
                    <span>Team {c.team}</span> • <span className="font-bold text-[#0d0e10]">{c.points} PTS</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleRevoke(c.id)}
                  title={`Revoke nomination for ${c.name}`}
                  className="p-2 rounded-full bg-[#ffffff] hover:bg-[#f4f4ee] border border-[#dcdcd3] text-[#0d0e10] transition-colors text-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </button>
                <button
                  onClick={() => onRequestEvict(c)}
                  title={`Evict ${c.name} immediately`}
                  className="px-3 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white transition-colors text-xs font-bold flex items-center gap-1 shadow-sm"
                >
                  <UserX className="w-3 h-3" />
                  <span>Evict</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
