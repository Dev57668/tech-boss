import React, { useState } from 'react';
import { Megaphone, Send, Volume2 } from 'lucide-react';
import type { HouseAnnouncement, AnnouncementSeverity } from '../types/bigboss';
import { sound } from '../utils/sound';

interface BigBossAnnouncementsProps {
  announcements: HouseAnnouncement[];
  onBroadcastAnnouncement: (title: string, message: string, severity: AnnouncementSeverity) => void;
  onClearAnnouncements?: () => void;
}

export const BigBossAnnouncements: React.FC<BigBossAnnouncementsProps> = ({
  announcements,
  onBroadcastAnnouncement,
  onClearAnnouncements,
}) => {
  const [customMessage, setCustomMessage] = useState('');
  const [customTitle, setCustomTitle] = useState('Official Decree');
  const [severity, setSeverity] = useState<AnnouncementSeverity>('decree');

  const presetDecrees = [
    { title: 'Living Room Assembly', text: 'Bigg Boss chahte hain ki sabhi gharwale turant living area mein upasthit hon.', sev: 'decree' as const },
    { title: 'Rule Violation', text: 'House rule violation: English conversation is prohibited. 25 points deducted.', sev: 'warning' as const },
    { title: 'Task Alarm', text: 'Attention housemates: The buzzer has sounded. Task arena is now open.', sev: 'alert' as const },
  ];

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMessage.trim()) return;

    sound.play('alert');
    onBroadcastAnnouncement(
      customTitle.trim() || 'House Decree',
      customMessage.trim(),
      severity
    );
    setCustomMessage('');
  };

  const handleSendPreset = (preset: typeof presetDecrees[0]) => {
    sound.play('alert');
    onBroadcastAnnouncement(preset.title, preset.text, preset.sev);
  };

  const getSeverityStyle = (sev: AnnouncementSeverity) => {
    switch (sev) {
      case 'decree':
        return {
          border: 'border-amber-500/50',
          bg: 'bg-amber-950/20',
          badge: 'bg-amber-950 border-amber-500/50 text-amber-300',
        };
      case 'warning':
        return {
          border: 'border-rose-500/50',
          bg: 'bg-rose-950/20',
          badge: 'bg-rose-950 border-rose-500/50 text-rose-300',
        };
      case 'alert':
        return {
          border: 'border-red-600/60',
          bg: 'bg-red-950/30',
          badge: 'bg-red-950 border-red-600 text-red-300',
        };
      default:
        return {
          border: 'border-zinc-700',
          bg: 'bg-zinc-900/40',
          badge: 'bg-zinc-800 text-zinc-300',
        };
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800/90 bg-gradient-to-br from-zinc-900/90 via-[#0e0e13] to-zinc-950 p-5 backdrop-blur-xl shadow-xl flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Megaphone className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-black text-base uppercase tracking-wider text-white flex items-center gap-2">
              BIG BOSS ANNOUNCEMENTS
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/70 text-amber-400 border border-amber-800/40">
                OFFICIAL PA SYSTEM
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400">Broadcast official orders directly to the housemates</p>
          </div>
        </div>

        {announcements.length > 0 && onClearAnnouncements && (
          <button
            onClick={onClearAnnouncements}
            className="text-[11px] text-zinc-500 hover:text-zinc-300 font-mono transition-colors"
          >
            Clear feed
          </button>
        )}
      </div>

      {/* Preset Quick Announcements */}
      <div>
        <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
          Iconic Big Boss Decrees:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {presetDecrees.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPreset(p)}
              className="text-left p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 hover:border-amber-500/40 text-xs transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 text-[11px] group-hover:text-amber-200">
                  {p.title}
                </span>
                <Volume2 className="w-3 h-3 text-zinc-500 group-hover:text-amber-400" />
              </div>
              <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">{p.text}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Broadcast Input with Title and Severity Selectors */}
      <form onSubmit={handleBroadcast} className="space-y-2 pt-1">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder="Decree Title..."
            className="px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value as AnnouncementSeverity)}
            className="px-2.5 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-700 text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
          >
            <option value="decree">Decree (Gold)</option>
            <option value="warning">Warning (Rose)</option>
            <option value="alert">Red Alert (Siren)</option>
            <option value="general">General (Standard)</option>
          </select>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all active:scale-95 shrink-0 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Broadcast</span>
          </button>
        </div>

        <div>
          <input
            type="text"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Type message for the housemates..."
            className="w-full px-3.5 py-2 rounded-xl bg-zinc-900/90 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </form>

      {/* Announcements Stream */}
      <div className="space-y-2 overflow-y-auto max-h-[220px] pr-1 flex-1">
        {announcements.length === 0 ? (
          <div className="py-6 px-4 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 text-center flex flex-col items-center justify-center">
            <Megaphone className="w-5 h-5 text-zinc-600 mb-1.5" />
            <h4 className="text-xs font-bold text-zinc-300">No Announcements Active</h4>
            <p className="text-[11px] text-zinc-500 max-w-xs mt-0.5">
              Broadcast a decree above to command the house.
            </p>
          </div>
        ) : (
          announcements.map((ann) => {
            const style = getSeverityStyle(ann.severity);
            return (
              <div
                key={ann.id}
                className={`rounded-xl border p-3 ${style.border} ${style.bg} transition-all`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${style.badge}`}>
                      {ann.severity}
                    </span>
                    <h5 className="font-bold text-xs text-white">{ann.title}</h5>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">{ann.timestamp}</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">{ann.message}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
