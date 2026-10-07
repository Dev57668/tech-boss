import React, { useState } from 'react';
import { Radio } from 'lucide-react';
import type { HouseAnnouncement } from '../types/bigboss';

interface AnnouncementsProps {
  announcements: HouseAnnouncement[];
  onBroadcast: (message: string, severity?: 'normal' | 'urgent' | 'alert') => void;
}

export const Announcements: React.FC<AnnouncementsProps> = ({
  announcements,
  onBroadcast,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [severity] = useState<'normal' | 'urgent' | 'alert'>('urgent');

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
        </div>
      )}

      {/* Broadcast Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Issue Big Boss proclamation..."
          className="flex-1 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
        >
          Decree
        </button>
      </form>
    </div>
  );
};
