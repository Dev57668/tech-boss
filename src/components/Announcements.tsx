import React, { useState } from 'react';
import { Megaphone, Send, Radio } from 'lucide-react';
import type { Announcement } from '../types/bigboss';

interface AnnouncementsProps {
  announcements: Announcement[];
  onBroadcast: (message: string, severity: 'normal' | 'urgent' | 'alert') => void;
}

export const Announcements: React.FC<AnnouncementsProps> = ({
  announcements,
  onBroadcast,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [severity, setSeverity] = useState<'normal' | 'urgent' | 'alert'>('urgent');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    onBroadcast(inputMessage.trim(), severity);
    setInputMessage('');
  };

  const latestAnnouncement = announcements[0];

  return (
    <div className="space-y-3">
      {/* Active Broadcast Marquee Banner */}
      {latestAnnouncement && (
        <div className="relative overflow-hidden rounded-xl border border-red-600/70 bg-gradient-to-r from-red-950/90 via-black to-red-950/90 p-3 backdrop-blur-md shadow-[0_0_25px_rgba(239,68,68,0.25)] flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-red-600 text-white text-[10px] font-black uppercase tracking-widest shrink-0 animate-pulse">
            <Radio className="w-3.5 h-3.5" />
            <span>BIG BOSS SPEAKS</span>
          </div>

          <div className="flex-1 overflow-hidden">
            <p className="text-xs sm:text-sm font-semibold text-white tracking-wide truncate">
              {latestAnnouncement.message}
            </p>
          </div>

          <span className="text-[10px] font-mono text-red-400 shrink-0 hidden sm:inline">
            {latestAnnouncement.timestamp}
          </span>
        </div>
      )}

      {/* Broadcast Command Input Card */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:p-5 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-950/50 border border-red-600/40 text-red-500">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base tracking-wide text-white uppercase flex items-center gap-2">
                BIG BOSS ANNOUNCEMENTS
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  HOUSE BROADCAST
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400">Broadcast official orders and decrees to the entire house</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="&quot;Big Boss chahte hain ki...&quot; (Enter decree message)"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>

          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value as 'normal' | 'urgent' | 'alert')}
            className="px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-xs font-semibold text-zinc-300 focus:outline-none focus:border-red-500"
          >
            <option value="urgent">Urgent Warning</option>
            <option value="normal">General Order</option>
            <option value="alert">Critical Penalty</option>
          </select>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.3)] active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>BROADCAST</span>
          </button>
        </form>
      </div>
    </div>
  );
};
