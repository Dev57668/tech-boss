import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Zap, FileText, AlertCircle } from 'lucide-react';
import type { Contestant } from '../types/bigboss';

interface CustomPointModalProps {
  contestant: Contestant | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyPoints: (contestantId: string, delta: number, reason: string) => void;
  onErrorToast?: (msg: string) => void;
}

export const CustomPointModal: React.FC<CustomPointModalProps> = ({
  contestant,
  isOpen,
  onClose,
  onApplyPoints,
  onErrorToast,
}) => {
  const [amount, setAmount] = useState<string>('20');
  const [isDeduction, setIsDeduction] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('Task Performance');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Keyboard accessibility: Escape key closes modal
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

  const quickReasons = [
    { label: 'Task Victory', defaultDelta: 50, deduct: false },
    { label: 'Captaincy Challenge', defaultDelta: 30, deduct: false },
    { label: 'Secret Room Twist', defaultDelta: 40, deduct: false },
    { label: 'Rule Violation (Language)', defaultDelta: 25, deduct: true },
    { label: 'Microphone Neglect', defaultDelta: 15, deduct: true },
    { label: 'House Brawl Penalty', defaultDelta: 50, deduct: true },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const raw = amount.trim();

    // 1. Empty input check
    if (!raw) {
      const msg = 'Please enter a valid point amount (cannot be empty).';
      setErrorMsg(msg);
      onErrorToast?.(msg);
      return;
    }

    // 2. Parse float to detect decimal & validity
    const parsedNum = parseFloat(raw);
    if (isNaN(parsedNum)) {
      const msg = 'Invalid numeric input. Please enter numbers only.';
      setErrorMsg(msg);
      onErrorToast?.(msg);
      return;
    }

    // 3. Absolute integer conversion
    const intAmount = Math.round(Math.abs(parsedNum));

    // 4. Zero or negative check
    if (intAmount <= 0) {
      const msg = 'Point value must be greater than zero.';
      setErrorMsg(msg);
      onErrorToast?.(msg);
      return;
    }

    // 5. Huge number guard (bounded to 1000)
    if (intAmount > 1000) {
      const msg = 'Points decree cannot exceed 1,000 PTS per decree.';
      setErrorMsg(msg);
      onErrorToast?.(msg);
      return;
    }

    const shouldDeduct = raw.startsWith('-') ? true : isDeduction;
    const finalDelta = shouldDeduct ? -intAmount : intAmount;

    onApplyPoints(contestant.id, finalDelta, reason.trim() || 'Official Decree');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-point-title"
    >
      <div className="relative w-full max-w-md rounded-3xl border border-[#2b2e35] bg-[#0d0e10] text-white p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#75766f] hover:text-white hover:bg-[#1f2126] transition-colors"
          aria-label="Close points modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-[#1c1f24] border border-[#2b2e35] text-[#d4ff3a] flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 id="custom-point-title" className="font-heading text-lg font-black text-white uppercase tracking-tight">
              Big Boss Point Decree
            </h3>
            <p className="text-xs text-[#a0a299]">
              Adjust points for <span className="text-[#d4ff3a] font-bold">{contestant.name}</span> (Current: {contestant.points} pts)
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Add vs Deduct Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-full bg-[#16181c] border border-[#2b2e35]">
            <button
              type="button"
              onClick={() => {
                setIsDeduction(false);
                setErrorMsg('');
              }}
              className={`flex items-center justify-center gap-2 py-2 rounded-full text-xs font-bold transition-all ${
                !isDeduction
                  ? 'framer-lime-btn shadow-md'
                  : 'text-[#a0a299] hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              AWARD POINTS
            </button>
            <button
              type="button"
              onClick={() => {
                setIsDeduction(true);
                setErrorMsg('');
              }}
              className={`flex items-center justify-center gap-2 py-2 rounded-full text-xs font-bold transition-all ${
                isDeduction
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-[#a0a299] hover:text-white'
              }`}
            >
              <Minus className="w-3.5 h-3.5" />
              PENALIZE POINTS
            </button>
          </div>

          {/* Amount input */}
          <div>
            <label htmlFor="point-amount" className="block text-xs font-mono font-bold text-[#a0a299] uppercase mb-1.5">
              Custom Points Amount (Max 1,000 PTS)
            </label>
            <div className="relative">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold font-mono text-lg ${
                isDeduction ? 'text-rose-400' : 'text-[#d4ff3a]'
              }`}>
                {isDeduction ? '-' : '+'}
              </span>
              <input
                id="point-amount"
                type="number"
                min="1"
                max="1000"
                step="1"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Enter points (1 - 1000)..."
                className="w-full pl-9 pr-4 py-2.5 rounded-full bg-[#16181c] border border-[#2b2e35] text-white font-mono text-lg font-bold focus:outline-none focus:ring-1 focus:ring-[#d4ff3a]"
                autoFocus
              />
            </div>
            {errorMsg && (
              <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errorMsg}
              </p>
            )}
          </div>

          {/* Presets */}
          <div>
            <span className="block text-[11px] font-mono font-bold text-[#75766f] uppercase mb-1.5">
              Official Task Preset
            </span>
            <div className="grid grid-cols-2 gap-1.5 mb-2">
              {quickReasons.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setAmount(r.defaultDelta.toString());
                    setIsDeduction(r.deduct);
                    setReason(r.label);
                    setErrorMsg('');
                  }}
                  className={`text-left text-xs p-2 rounded-2xl border transition-all truncate ${
                    reason === r.label
                      ? 'bg-[#1f2126] border-[#d4ff3a] text-white font-bold'
                      : 'bg-[#16181c] border-[#2b2e35] text-[#a0a299] hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <FileText className="w-3.5 h-3.5 text-[#75766f] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Custom reason description..."
                className="w-full pl-9 pr-3 py-2 rounded-full bg-[#16181c] border border-[#2b2e35] text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#d4ff3a]"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-[#1c1f24] hover:bg-[#282b32] text-xs font-bold text-[#e0e2d8] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 ${
                isDeduction
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'framer-lime-btn'
              }`}
            >
              Apply Decree
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
