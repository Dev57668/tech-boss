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

    // 3. Absolute integer conversion (handles decimals by rounding)
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

    // Check if input originally had negative sign and auto-adjust deduction
    const shouldDeduct = raw.startsWith('-') ? true : isDeduction;
    const finalDelta = shouldDeduct ? -intAmount : intAmount;

    onApplyPoints(contestant.id, finalDelta, reason.trim() || 'Official Decree');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-point-title"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-red-900/70 bg-[#101015] p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
          aria-label="Close points modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-700/50 text-red-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 id="custom-point-title" className="font-heading text-lg font-bold text-white uppercase tracking-wider">
              Big Boss Point Decree
            </h3>
            <p className="text-xs text-zinc-400">
              Adjust points for <span className="text-red-400 font-bold">{contestant.name}</span> (Current: {contestant.points} pts)
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Add vs Deduct Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
            <button
              type="button"
              onClick={() => {
                setIsDeduction(false);
                setErrorMsg('');
              }}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                !isDeduction
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              } focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none`}
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
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                isDeduction
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              } focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none`}
            >
              <Minus className="w-3.5 h-3.5" />
              PENALIZE POINTS
            </button>
          </div>

          {/* Amount input */}
          <div>
            <label htmlFor="point-amount" className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
              Custom Points Amount (Max 1,000 PTS)
            </label>
            <div className="relative">
              <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 font-bold font-mono text-lg ${
                isDeduction ? 'text-rose-400' : 'text-emerald-400'
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
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-700 text-white font-mono text-lg font-bold focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                autoFocus
              />
            </div>
            {errorMsg && (
              <p className="flex items-center gap-1.5 text-xs text-rose-400 mt-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </p>
            )}
          </div>

          {/* Preset Reasons */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1.5">
              Official Justification / Task
            </label>
            <div className="grid grid-cols-2 gap-1.5 mb-2">
              {quickReasons.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setReason(preset.label);
                    setAmount(preset.defaultDelta.toString());
                    setIsDeduction(preset.deduct);
                    setErrorMsg('');
                  }}
                  className={`text-left text-[11px] p-2 rounded-lg border transition-all truncate ${
                    reason === preset.label
                      ? 'bg-zinc-800 border-red-500 text-white font-semibold'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  } focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <FileText className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Custom reason or task name..."
                className="w-full pl-8 pr-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700/80 text-xs text-zinc-200 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition-colors focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-lg ${
                isDeduction
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
              } focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none`}
            >
              Confirm Decree ({isDeduction ? `-${amount || 0}` : `+${amount || 0}`} PTS)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
