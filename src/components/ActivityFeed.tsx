import React, { useState } from 'react';
import { 
  Activity, 
  Crown, 
  PlusCircle, 
  MinusCircle, 
  AlertOctagon, 
  ShieldCheck, 
  UserX, 
  Trash2,
  Award,
  Megaphone,
  Radio
} from 'lucide-react';
import type { ActivityLog } from '../types/bigboss';

interface ActivityFeedProps {
  activities: ActivityLog[];
  onClearLogs: () => void;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, onClearLogs }) => {
  const [filter, setFilter] = useState<'all' | 'points' | 'captain' | 'nomination' | 'immunity' | 'eviction' | 'tasks'>('all');

  const filtered = activities.filter((act) => {
    if (filter === 'all') return true;
    if (filter === 'points') return act.type === 'points_add' || act.type === 'points_deduct';
    if (filter === 'captain') return act.type === 'captain_change';
    if (filter === 'nomination') return act.type === 'nomination_add' || act.type === 'nomination_remove';
    if (filter === 'immunity') return act.type === 'immunity_grant' || act.type === 'immunity_revoke';
    if (filter === 'eviction') return act.type === 'eviction' || act.type === 'reinstated';
    if (filter === 'tasks') return act.type === 'task_complete';
    return true;
  });

  const getIconAndStyle = (type: ActivityLog['type']) => {
    switch (type) {
      case 'captain_change':
        return {
          icon: Crown,
          iconColor: 'text-amber-400 fill-amber-400',
          bgBadge: 'bg-amber-950/40 border-amber-500/40',
          textClass: 'text-amber-300',
        };
      case 'points_add':
        return {
          icon: PlusCircle,
          iconColor: 'text-emerald-400',
          bgBadge: 'bg-emerald-950/40 border-emerald-500/40',
          textClass: 'text-emerald-300',
        };
      case 'points_deduct':
        return {
          icon: MinusCircle,
          iconColor: 'text-rose-400',
          bgBadge: 'bg-rose-950/40 border-rose-500/40',
          textClass: 'text-rose-300',
        };
      case 'nomination_add':
      case 'nomination_remove':
        return {
          icon: AlertOctagon,
          iconColor: 'text-rose-400',
          bgBadge: 'bg-rose-950/40 border-rose-500/40',
          textClass: 'text-rose-300',
        };
      case 'immunity_grant':
      case 'immunity_revoke':
        return {
          icon: ShieldCheck,
          iconColor: 'text-cyan-400',
          bgBadge: 'bg-cyan-950/40 border-cyan-500/40',
          textClass: 'text-cyan-300',
        };
      case 'eviction':
      case 'reinstated':
        return {
          icon: UserX,
          iconColor: 'text-red-500',
          bgBadge: 'bg-red-950/60 border-red-600/50',
          textClass: 'text-red-300',
        };
      case 'task_complete':
        return {
          icon: Award,
          iconColor: 'text-yellow-400',
          bgBadge: 'bg-yellow-950/40 border-yellow-500/40',
          textClass: 'text-yellow-300',
        };
      case 'announcement':
        return {
          icon: Megaphone,
          iconColor: 'text-amber-400',
          bgBadge: 'bg-amber-950/40 border-amber-500/40',
          textClass: 'text-amber-300',
        };
      default:
        return {
          icon: Activity,
          iconColor: 'text-zinc-400',
          bgBadge: 'bg-zinc-800 border-zinc-700',
          textClass: 'text-zinc-300',
        };
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/70 p-4 sm:p-5 backdrop-blur-xl shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-950/60 border border-red-700/50 text-red-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-heading font-black text-base uppercase tracking-wider text-white flex items-center gap-2">
              LIVE ACTIVITY LOG
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-normal">
                {activities.length}/100 MAX
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400">Chronological telemetry feed of house decrees</p>
          </div>
        </div>

        {activities.length > 0 && (
          <button
            onClick={onClearLogs}
            title="Clear all logs"
            className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-colors focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-2 text-xs">
        {[
          { key: 'all', label: 'All' },
          { key: 'points', label: 'Points' },
          { key: 'captain', label: 'Captain' },
          { key: 'nomination', label: 'Nominations' },
          { key: 'immunity', label: 'Immunity' },
          { key: 'eviction', label: 'Evictions' },
          { key: 'tasks', label: 'Tasks' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as typeof filter)}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
              filter === f.key
                ? 'bg-zinc-800 text-white font-bold border border-zinc-700 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            } focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Activity List or Empty State */}
      <div className="space-y-2 overflow-y-auto pr-1 flex-1 max-h-[500px]">
        {filtered.length === 0 ? (
          <div className="py-12 px-4 rounded-xl border border-dashed border-zinc-800 text-center flex flex-col items-center justify-center">
            <Activity className="w-6 h-6 text-zinc-600 mb-2" />
            <h4 className="text-xs font-bold text-zinc-400">No Activity Events Recorded</h4>
            <p className="text-[11px] text-zinc-600 mt-0.5">Actions performed in the house will stream here.</p>
          </div>
        ) : (
          filtered.map((act) => {
            const { icon: Icon, iconColor, bgBadge } = getIconAndStyle(act.type);

            return (
              <div
                key={act.id}
                className="rounded-xl border border-zinc-800/70 bg-zinc-950/60 p-3 hover:border-zinc-700/80 transition-all flex items-start gap-3 group"
              >
                <div className={`p-2 rounded-lg border shrink-0 mt-0.5 ${bgBadge}`}>
                  <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-white truncate">
                      {act.contestantName}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500 shrink-0">
                      {act.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 mt-0.5 leading-snug">
                    {act.message}
                  </p>

                  {act.details && (
                    <div className="text-[10px] text-zinc-500 font-mono mt-1">
                      {act.details}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
