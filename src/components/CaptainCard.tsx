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
    <div className="relative overflow-hidden rounded-3xl border border-[#23252a] bg-[#0d0e10] text-[#ffffff] p-6 sm:p-8 shadow-[0_16px_50px_-10px_rgba(0,0,0,0.25)]">
      {/* Background Lime Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4ff3a]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left: Captain Profile */}
        <div className="flex items-center gap-5">
          {/* Avatar with Lime Ring */}
          <div className="relative">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#d4ff3a] to-[#a1c914] p-0.5 shadow-[0_0_25px_rgba(212,255,58,0.3)]">
              <div className="w-full h-full rounded-[14px] bg-[#0d0e10] flex items-center justify-center font-heading text-2xl sm:text-3xl font-black text-[#d4ff3a]">
                {captain ? captain.name.substring(0, 2).toUpperCase() : '??'}
              </div>
            </div>
            {/* Crown Pill */}
            <div className="absolute -top-2.5 -right-2.5 bg-[#d4ff3a] text-[#0d0e10] p-1.5 rounded-full shadow-md">
              <Crown className="w-4 h-4 fill-[#0d0e10]" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4ff3a] text-[#0d0e10] text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                REIGNING HOUSE CAPTAIN
              </span>
              <span className="text-xs font-mono text-[#a0a299]">
                WEEK 3 COMMAND
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mt-1.5 tracking-tight flex items-center gap-2.5">
              {captain ? captain.name : 'VACANT POSITION'}
              {captain && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#1c1f24] text-[#a0a299] border border-[#2b2e35] font-mono">
                  Team {captain.team}
                </span>
              )}
            </h2>

            <p className="text-xs sm:text-sm text-[#a0a299] mt-1 max-w-lg leading-relaxed">
              {captain?.bio || 'The Captain commands executive privileges, immunity from weekly eviction, and decisive veto power in house deliberations.'}
            </p>
          </div>
        </div>

        {/* Center: Privileges Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="px-4 py-2 rounded-full bg-[#16181c] border border-[#2b2e35] text-xs flex items-center gap-2 text-[#ffffff]">
            <Shield className="w-3.5 h-3.5 text-[#d4ff3a]" />
            <span className="font-semibold text-xs">Immunity Shield Active</span>
          </div>

          <div className="px-4 py-2 rounded-full bg-[#16181c] border border-[#2b2e35] text-xs flex items-center gap-2 text-[#ffffff]">
            <UserCheck className="w-3.5 h-3.5 text-[#d4ff3a]" />
            <span className="font-semibold text-xs">Captain Suite & Veto Power</span>
          </div>
        </div>

        {/* Right: Change Captain Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSelecting(!isSelecting)}
            className="w-full sm:w-auto framer-lime-btn px-6 py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
          >
            <Crown className="w-4 h-4 fill-[#0d0e10]" />
            <span>APPOINT CAPTAIN</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isSelecting ? 'rotate-180' : ''}`} />
          </button>

          {/* Selector Dropdown */}
          {isSelecting && (
            <div className="absolute right-0 top-full mt-2 w-72 max-h-72 overflow-y-auto rounded-3xl bg-[#16181c] border border-[#2b2e35] shadow-2xl p-2 z-50 divide-y divide-[#23252a] animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 text-[10px] font-mono font-bold tracking-wider text-[#d4ff3a] uppercase">
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
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-medium text-left transition-colors ${
                        isCurrent
                          ? 'bg-[#d4ff3a]/20 text-[#d4ff3a] cursor-default'
                          : 'text-[#e0e2d8] hover:bg-[#23252a] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{c.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0d0e10] text-[#a0a299]">
                          {c.team}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[#a0a299]">{c.points} pts</span>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-[#d4ff3a]" />}
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
