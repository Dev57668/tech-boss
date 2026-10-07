import React, { useState } from 'react';
import { Crown, Sparkles, Shield, UserCheck, ChevronDown, Check } from 'lucide-react';
import type { Contestant } from '../types/bigboss';
import { sound } from '../utils/sound';

interface CaptainCardProps {
  captain: Contestant | undefined;
  activeContestants: Contestant[];
  onSetCaptain: (newCaptainId: string) => void;
}

export const CaptainCard: React.FC<CaptainCardProps> = ({
  captain,
  activeContestants,
  onSetCaptain,
}) => {
  const [isSelecting, setIsSelecting] = useState(false);

  const handleSelect = (contestantId: string) => {
    sound.play('crown');
    onSetCaptain(contestantId);
    setIsSelecting(false);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-950/30 via-zinc-950/80 to-[#121008] p-5 lg:p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(245,158,11,0.12)]">
      {/* Golden spotlight radial background */}
      <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Left: Captain Banner & Profile */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Avatar with Gold Crown Ring */}
          <div className="relative group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-600 to-yellow-700 p-[2px] shadow-[0_0_20px_rgba(245,158,11,0.35)]">
              <div className="w-full h-full rounded-[14px] bg-zinc-950 flex items-center justify-center font-heading text-2xl sm:text-3xl font-black text-amber-300">
                {captain ? captain.name.substring(0, 2).toUpperCase() : '??'}
              </div>
            </div>
            {/* Crown on top */}
            <div className="absolute -top-3 -right-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black p-1.5 rounded-full shadow-lg ring-2 ring-zinc-950">
              <Crown className="w-4 h-4 fill-black" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-bold tracking-widest uppercase">
                <Sparkles className="w-3 h-3 text-amber-400" />
                REIGNING HOUSE CAPTAIN
              </span>
              <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
                WEEK 3 COMMAND
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight flex items-center gap-2">
              {captain ? captain.name : 'VACANT POSITION'}
              {captain && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono">
                  Team {captain.team}
                </span>
              )}
            </h2>

            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-md">
              {captain?.bio || 'The Captain enjoys complete immunity from weekly nominations and holds decisive power in house disputes.'}
            </p>
          </div>
        </div>

        {/* Center: Captain Perks */}
        <div className="hidden xl:flex items-center gap-3">
          <div className="px-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-amber-500/20 text-xs flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="font-bold text-white uppercase text-[10px] tracking-wider">Immunity Shield</div>
              <div className="text-zinc-400 text-[11px]">Protected from eviction</div>
            </div>
          </div>

          <div className="px-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-amber-500/20 text-xs flex items-center gap-2.5">
            <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="font-bold text-white uppercase text-[10px] tracking-wider">Captain Room</div>
              <div className="text-zinc-400 text-[11px]">Luxury suite privileges</div>
            </div>
          </div>
        </div>

        {/* Right: Change Captain Action */}
        <div className="relative w-full md:w-auto">
          <button
            onClick={() => setIsSelecting(!isSelecting)}
            aria-expanded={isSelecting}
            aria-label="Change House Captain"
            className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 hover:from-amber-400 to-yellow-600 text-black font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:outline-none"
          >
            <Crown className="w-4 h-4 fill-black" />
            <span>CHANGE CAPTAIN</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isSelecting ? 'rotate-180' : ''}`} />
          </button>

          {/* Captain Dropdown Menu (Only active contestants) */}
          {isSelecting && (
            <div className="absolute right-0 top-full mt-2 w-72 max-h-72 overflow-y-auto rounded-xl bg-zinc-900 border border-amber-500/40 shadow-2xl p-2 z-50 divide-y divide-zinc-800/80 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-amber-400 uppercase">
                Select Active Housemate
              </div>
              <div className="pt-1 space-y-1">
                {activeContestants.map((c) => {
                  const isCurrent = captain?.id === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleSelect(c.id)}
                      disabled={isCurrent}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                        isCurrent
                          ? 'bg-amber-500/20 text-amber-300 cursor-default'
                          : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                      } focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-sm">{c.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                          {c.team}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-zinc-400">{c.points} pts</span>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
