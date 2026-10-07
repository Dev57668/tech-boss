import React, { useState } from 'react';
import { Eye, Crown, RotateCcw, Volume2, VolumeX, Menu, X, ArrowUpRight } from 'lucide-react';
import type { Contestant } from '../types/bigboss';

interface HeaderProps {
  currentCaptain: Contestant | undefined;
  activeCount: number;
  totalCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetData: () => void;
  onNavigate?: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCaptain,
  activeCount,
  totalCount,
  soundEnabled,
  onToggleSound,
  onResetData,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Overview', id: 'section-overview' },
    { label: 'Housemates', id: 'section-housemates' },
    { label: 'Leaderboard', id: 'section-leaderboard' },
    { label: 'Tasks', id: 'section-tasks' },
    { label: 'Danger Zone', id: 'section-danger' },
  ];

  const handleScroll = (id: string) => {
    onNavigate?.(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-4 z-40 px-4 max-w-7xl mx-auto w-full">
      {/* Floating Pill Bar */}
      <div className="bg-[#ffffff]/90 backdrop-blur-xl border border-[#dcdcd3] rounded-full px-4 sm:px-6 py-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between transition-all">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-[#0d0e10] flex items-center justify-center text-[#d4ff3a] group-hover:scale-105 transition-transform shadow-sm">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <span className="font-heading font-black text-sm tracking-tight text-[#0d0e10] flex items-center gap-1.5 uppercase">
                BIG BOSS
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff3a]"></span>
              </span>
              <span className="text-[10px] text-[#75766f] font-mono block -mt-0.5 tracking-wider uppercase">
                HQ COMMAND
              </span>
            </div>
          </a>

          {/* Live Indicator Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4f4ee] border border-[#e2e2d8] text-[11px] font-semibold text-[#0d0e10]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4ff3a] opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4ff3a]"></span>
            </span>
            <span className="font-mono text-[10px] tracking-wider uppercase">LIVE</span>
            <span className="text-[#a4a59d]">•</span>
            <span className="text-[#75766f] font-mono text-[10px]">{activeCount}/{totalCount} Active</span>
          </div>
        </div>

        {/* Center: Nav links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#f4f4ee] p-1 rounded-full border border-[#e2e2d8]">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleScroll(link.id)}
              className="px-3.5 py-1 rounded-full text-xs font-semibold text-[#75766f] hover:text-[#0d0e10] hover:bg-[#ffffff] transition-all"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right: Captain Badge & Actions */}
        <div className="flex items-center gap-2">
          {/* Captain badge */}
          {currentCaptain && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d0e10] text-[#ffffff] text-xs font-semibold shadow-sm">
              <Crown className="w-3.5 h-3.5 text-[#d4ff3a] fill-[#d4ff3a]" />
              <span className="text-[#a0a299] text-[10px] uppercase font-mono">Captain:</span>
              <span className="text-[#ffffff] font-bold">{currentCaptain.name}</span>
            </div>
          )}

          {/* Audio toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
            className="w-8 h-8 rounded-full border border-[#dcdcd3] bg-[#ffffff] hover:bg-[#f4f4ee] flex items-center justify-center text-[#0d0e10] transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#0d0e10]" /> : <VolumeX className="w-3.5 h-3.5 text-[#75766f]" />}
          </button>

          {/* Reset House CTA */}
          <button
            onClick={onResetData}
            title="Reset House state"
            className="hidden sm:flex items-center gap-1 px-3.5 py-1.5 rounded-full border border-[#dcdcd3] bg-[#ffffff] hover:bg-[#0d0e10] hover:text-[#ffffff] text-xs font-semibold text-[#0d0e10] transition-all active:scale-95"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          {/* Primary Lime CTA */}
          <a
            href="#section-housemates"
            className="framer-lime-btn px-4 py-1.5 text-xs font-bold flex items-center gap-1 shadow-sm"
          >
            <span>Direct Decree</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-full border border-[#dcdcd3] bg-[#ffffff] text-[#0d0e10]"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 p-3 bg-[#ffffff] border border-[#dcdcd3] rounded-3xl shadow-xl flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleScroll(link.id)}
              className="text-left px-4 py-2 rounded-xl text-xs font-semibold text-[#0d0e10] hover:bg-[#f4f4ee] transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-[#eeeee8] flex items-center justify-between px-2">
            <span className="text-xs font-mono text-[#75766f]">
              Captain: <strong className="text-[#0d0e10]">{currentCaptain?.name || 'Vacant'}</strong>
            </span>
            <button
              onClick={onResetData}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-[#f4f4ee] text-[#0d0e10]"
            >
              Reset House
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
