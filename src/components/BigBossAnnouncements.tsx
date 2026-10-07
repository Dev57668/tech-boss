import React, { useState } from 'react';
import { Megaphone, Send, Volume2, MessageSquare } from 'lucide-react';
import type { HouseAnnouncement } from '../types/bigboss';

interface BigBossAnnouncementsProps {
  announcements: HouseAnnouncement[];
  onBroadcast: (message: string) => void;
}

export const BigBossAnnouncements: React.FC<BigBossAnnouncementsProps> = ({
  announcements,
  onBroadcast,
}) => {
  const [inputText, setInputText] = useState('');

  const PRESETS = [
    'Attention housemates, assemble in the living room immediately.',
    'Task commences in 5 minutes. Prepare yourselves.',
    'Speaking in English is strictly prohibited. Penalties will apply.',
  ];

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > 200) return;
    onBroadcast(trimmed);
    setInputText('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputText);
  };

  const isOverLimit = inputText.length > 200;
  const isSendDisabled = !inputText.trim() || isOverLimit;

  return (
    <div className="rounded-3xl border border-[#dcdcd3] bg-[#ffffff] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#eeeee8]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#0d0e10] text-[#d4ff3a] flex items-center justify-center">
            <Megaphone className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-black text-base uppercase tracking-tight text-[#0d0e10] flex items-center gap-2">
              BIG BOSS ANNOUNCEMENTS
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#d4ff3a] text-[#0d0e10] font-bold">
                PA BROADCAST
              </span>
            </h3>
            <p className="text-xs text-[#75766f]">
              Issue official decrees with live top-screen marquee
            </p>
          </div>
        </div>
      </div>

      {/* 3 Quick-select Presets */}
      <div>
        <span className="block text-[11px] font-mono font-bold text-[#75766f] uppercase tracking-wider mb-2">
          Quick Decree Presets:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(preset)}
              className="text-left p-3 rounded-2xl bg-[#f4f4ee] hover:bg-[#eaeae2] border border-[#dcdcd3] text-xs transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#0d0e10] text-xs">
                  Preset #{idx + 1}
                </span>
                <Volume2 className="w-3.5 h-3.5 text-[#75766f] group-hover:text-[#0d0e10]" />
              </div>
              <p className="text-xs text-[#75766f] line-clamp-2 leading-snug">
                &quot;{preset}&quot;
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Input + Character Counter + Broadcast Button */}
      <form onSubmit={handleSubmit} className="space-y-1.5 pt-1">
        <div className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type custom Big Boss decree (max 200 characters)..."
            maxLength={250}
            className={`w-full pl-4 pr-24 py-2.5 rounded-full bg-[#f4f4ee] border text-xs text-[#0d0e10] placeholder-[#75766f] focus:outline-none transition-colors ${
              isOverLimit
                ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                : 'border-[#dcdcd3] focus:border-[#0d0e10] focus:ring-1 focus:ring-[#0d0e10]'
            }`}
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <span
              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                isOverLimit
                  ? 'text-rose-600 bg-rose-100'
                  : 'text-[#75766f]'
              }`}
            >
              {inputText.length}/200
            </span>

            <button
              type="submit"
              disabled={isSendDisabled}
              className="framer-lime-btn px-3.5 py-1.5 text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-3 h-3" />
              <span>Broadcast</span>
            </button>
          </div>
        </div>
      </form>

      {/* Live Announcement Feed */}
      <div className="space-y-2 overflow-y-auto max-h-[220px] pr-1 flex-1">
        {announcements.length === 0 ? (
          <div className="py-6 px-4 rounded-2xl border border-dashed border-[#dcdcd3] bg-[#f8f8f4] text-center flex flex-col items-center justify-center">
            <MessageSquare className="w-5 h-5 text-[#75766f] mb-1.5" />
            <h4 className="text-xs font-bold text-[#0d0e10]">No Announcements in Feed</h4>
            <p className="text-xs text-[#75766f] mt-0.5">Broadcast a decree above to command the house.</p>
          </div>
        ) : (
          announcements.map((ann) => (
            <div
              key={ann.id}
              className="rounded-2xl border border-[#dcdcd3] bg-[#fcfcf9] p-3.5 transition-all"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#0d0e10] text-[#d4ff3a] uppercase">
                  BIG BOSS DECREE
                </span>
                <span className="text-[10px] font-mono text-[#75766f]">{ann.timestamp}</span>
              </div>
              <p className="text-xs text-[#0d0e10] leading-relaxed font-medium">
                &quot;{ann.message}&quot;
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
