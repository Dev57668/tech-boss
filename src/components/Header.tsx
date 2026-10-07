import React from 'react';
import { 
  Crown, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Eye, 
  ShieldCheck, 
  Users
} from 'lucide-react';
import type { Contestant } from '../types/bigboss';

interface HeaderProps {
  currentCaptain: Contestant | undefined;
  activeCount: number;
  totalCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCaptain,
  activeCount,
  totalCount,
  soundEnabled,
  onToggleSound,
  onResetData,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#08080c]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand / Title & Big Boss Eye Icon */}
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 rounded-2xl bg-gradient-to-br from-red-600 to-rose-900 text-white shadow-[0_0_25px_rgba(239,68,68,0.4)] flex items-center justify-center ring-1 ring-red-500/50">
            <Eye className="w-6 h-6 animate-pulse" />
            <div className="absolute inset-0 rounded-2xl ring-2 ring-red-500/30 animate-ping pointer-events-none"></div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-xl sm:text-2xl tracking-widest text-white uppercase">
                BIG BOSS
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-950/80 border border-red-700/60 text-red-400 text-[10px] font-mono font-bold tracking-wider uppercase animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                LIVE COMMAND
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-400 tracking-wider uppercase">
              AUTOMATED HOUSE SURVEILLANCE & EXECUTIVE CONTROL
            </p>
          </div>
        </div>

        {/* Global Status Telemetry Pill */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          {/* Captain Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 font-medium">
            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-[10px] text-zinc-400 uppercase font-mono">Captain:</span>
            <span className="font-bold text-xs truncate max-w-[100px]">
              {currentCaptain ? currentCaptain.name : 'VACANT'}
            </span>
          </div>

          {/* Active Housemates Count */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700/70 text-zinc-300 font-mono">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] text-zinc-400 uppercase">Active:</span>
            <span className="font-bold text-white">
              {activeCount}/{totalCount}
            </span>
          </div>

          {/* House State Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700/70 text-emerald-400 font-mono text-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-bold">HOUSE ACTIVE</span>
          </div>
        </div>

        {/* Controls: Audio Toggle & Reset House */}
        <div className="flex items-center gap-2">
          {/* Audio FX Toggle */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            title={soundEnabled ? 'Audio FX Enabled' : 'Audio FX Muted'}
            className={`p-2.5 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:text-white'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
            } focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* DEMO-FRIENDLY: Visible "Reset House" Button */}
          <button
            onClick={onResetData}
            aria-label="Reset house data to initial season state"
            title="Restore initial seed data (brings back all contestants)"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 hover:text-white text-xs font-bold transition-all active:scale-95 shadow-sm focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
          >
            <RotateCcw className="w-3.5 h-3.5 text-red-400" />
            <span>RESET HOUSE</span>
          </button>
        </div>

      </div>
    </header>
  );
};
