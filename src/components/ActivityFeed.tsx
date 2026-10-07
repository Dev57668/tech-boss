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
    if (filter === 'tasks') return act.type === 'task_complete' || act.type === 'task_create' || act.type === 'task_cancel';
    return true;
  });

  const getIconAndStyle = (type: ActivityLog['type']) => {
    switch (type) {
      case 'captain_change':
        return {
          icon: Crown,
          iconColor: 'text-[#0d0e10]',
          bgBadge: 'bg-[#d4ff3a] text-[#0d0e10]',
        };
      case 'points_add':
        return {
          icon: PlusCircle,
          iconColor: 'text-emerald-700',
          bgBadge: 'bg-emerald-100 text-emerald-800',
        };
      case 'points_deduct':
        return {
          icon: MinusCircle,
          iconColor: 'text-rose-700',
          bgBadge: 'bg-rose-100 text-rose-800',
        };
      case 'nomination_add':
      case 'nomination_remove':
      case 'nomination_clear_all':
        return {
          icon: AlertOctagon,
          iconColor: 'text-rose-700',
          bgBadge: 'bg-rose-100 text-rose-800',
        };
      case 'immunity_grant':
      case 'immunity_revoke':
        return {
          icon: ShieldCheck,
          iconColor: 'text-emerald-700',
          bgBadge: 'bg-emerald-100 text-emerald-800',
        };
      case 'eviction':
      case 'reinstated':
        return {
          icon: UserX,
          iconColor: 'text-white',
          bgBadge: 'bg-[#0d0e10] text-white',
        };
      case 'task_complete':
      case 'task_create':
      case 'task_cancel':
      case 'task_delete':
        return {
          icon: Award,
          iconColor: 'text-amber-800',
          bgBadge: 'bg-amber-100 text-amber-900',
        };
      case 'announcement':
        return {
          icon: Megaphone,
          iconColor: 'text-[#0d0e10]',
          bgBadge: 'bg-[#d4ff3a] text-[#0d0e10]',
        };
      default:
        return {
          icon: Activity,
          iconColor: 'text-[#75766f]',
          bgBadge: 'bg-[#f4f4ee] text-[#0d0e10]',
        };
    }
  };

  return (
    <div className="rounded-3xl border border-[#dcdcd3] bg-[#ffffff] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#eeeee8]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#0d0e10] text-[#d4ff3a] flex items-center justify-center">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-heading font-black text-base uppercase tracking-tight text-[#0d0e10] flex items-center gap-2">
              LIVE ACTIVITY LOG
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#f4f4ee] text-[#0d0e10] font-bold">
                {activities.length}/100 MAX
              </span>
            </h3>
            <p className="text-xs text-[#75766f]">Chronological telemetry feed of house events</p>
          </div>
        </div>

        {activities.length > 0 && (
          <button
            onClick={onClearLogs}
            title="Clear all logs"
            className="p-2 rounded-full text-[#75766f] hover:text-rose-600 hover:bg-[#f4f4ee] transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 text-xs">
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
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filter === f.key
                ? 'bg-[#0d0e10] text-white shadow-sm'
                : 'bg-[#f4f4ee] text-[#75766f] hover:text-[#0d0e10]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Activity List or Empty State */}
      <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 max-h-[500px]">
        {filtered.length === 0 ? (
          <div className="py-12 px-4 rounded-2xl border border-dashed border-[#dcdcd3] bg-[#f8f8f4] text-center flex flex-col items-center justify-center">
            <Activity className="w-6 h-6 text-[#75766f] mb-2" />
            <h4 className="text-xs font-bold text-[#0d0e10]">No Activity Events Recorded</h4>
            <p className="text-xs text-[#75766f] mt-0.5">House actions and decrees will stream here.</p>
          </div>
        ) : (
          filtered.map((act) => {
            const { icon: Icon, bgBadge } = getIconAndStyle(act.type);

            return (
              <div
                key={act.id}
                className="rounded-2xl border border-[#eeeee8] bg-[#fbfbf8] p-3.5 hover:border-[#dcdcd3] transition-all flex items-start gap-3 group"
              >
                <div className={`p-2 rounded-full shrink-0 mt-0.5 ${bgBadge}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-xs text-[#0d0e10] truncate">
                      {act.contestantName}
                    </span>
                    <span className="font-mono text-[10px] text-[#75766f] shrink-0">
                      {act.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-[#0d0e10] mt-0.5 leading-snug">
                    {act.message}
                  </p>

                  {act.details && (
                    <div className="text-[10px] text-[#75766f] font-mono mt-1">
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
