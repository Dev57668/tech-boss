import React, { useEffect } from 'react';
import { AlertOctagon, UserX, X } from 'lucide-react';
import type { Contestant } from '../types/bigboss';

interface EvictionConfirmModalProps {
  contestant: Contestant | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmEviction: (contestantId: string) => void;
}

export const EvictionConfirmModal: React.FC<EvictionConfirmModalProps> = ({
  contestant,
  isOpen,
  onClose,
  onConfirmEviction,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !contestant) return null;

  const handleConfirm = () => {
    onConfirmEviction(contestant.id);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="eviction-modal-title"
    >
      <div className="relative w-full max-w-md rounded-3xl border border-[#2b2e35] bg-[#0d0e10] text-white p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#75766f] hover:text-white hover:bg-[#1f2126] transition-colors"
          aria-label="Close eviction dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-full bg-rose-950/80 border border-rose-600/40 text-rose-500 flex items-center justify-center">
            <UserX className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300">
              IRREVOCABLE DECREE
            </span>
            <h3 id="eviction-modal-title" className="font-heading text-lg font-black text-white uppercase tracking-tight mt-0.5">
              CONFIRM HOUSE EVICTION
            </h3>
          </div>
        </div>

        {/* Eviction Notice Body */}
        <div className="rounded-2xl border border-[#23252a] bg-[#16181c] p-4 mb-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-heading text-base font-bold text-white shadow-md bg-gradient-to-br ${contestant.avatarColor}`}>
              {contestant.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white">{contestant.name}</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-mono bg-[#23252a] text-[#a0a299]">
                  Team {contestant.team}
                </span>
              </div>
              <p className="text-xs text-[#a0a299] font-mono mt-0.5">
                Current Score: <span className="text-[#d4ff3a] font-bold">{contestant.points} PTS</span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 pt-2 border-t border-[#23252a] text-xs text-rose-300 leading-relaxed">
            <AlertOctagon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <p>
              Evict <strong className="text-white font-bold">{contestant.name}</strong>? This cannot be undone.
              They will be permanently removed from the live leaderboard and captaincy eligibility.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-[#1c1f24] hover:bg-[#282b32] text-xs font-bold text-[#e0e2d8] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            autoFocus
            className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-black tracking-wider uppercase transition-all shadow-md active:scale-95"
          >
            Evict Contestant
          </button>
        </div>
      </div>
    </div>
  );
};
