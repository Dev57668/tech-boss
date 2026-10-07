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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="eviction-modal-title"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-red-600/80 bg-[#120a0d] p-6 shadow-[0_0_50px_rgba(220,38,38,0.35)] animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
          aria-label="Close eviction dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="p-3 rounded-2xl bg-red-950 border border-red-600/60 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800/40">
              IRREVOCABLE DECREE
            </span>
            <h3 id="eviction-modal-title" className="font-heading text-xl font-extrabold text-white uppercase tracking-wider mt-0.5">
              CONFIRM HOUSE EVICTION
            </h3>
          </div>
        </div>

        {/* Eviction Notice Body */}
        <div className="rounded-xl border border-red-950/80 bg-zinc-950/70 p-4 mb-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-heading text-lg font-bold text-white shadow-md bg-gradient-to-br ${contestant.avatarColor}`}>
              {contestant.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white">{contestant.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-zinc-800 text-zinc-300">
                  Team {contestant.team}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Current Score: <span className="text-amber-400 font-bold">{contestant.points} PTS</span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 pt-2 border-t border-zinc-900 text-xs text-red-300/90 leading-relaxed">
            <AlertOctagon className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
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
            className="px-4 py-2.5 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-xs font-bold text-zinc-300 transition-colors focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            autoFocus
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-black tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(220,38,38,0.5)] active:scale-95 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none"
          >
            Evict Contestant
          </button>
        </div>
      </div>
    </div>
  );
};
