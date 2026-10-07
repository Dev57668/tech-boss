import React from 'react';
import { 
  Users, 
  Trophy, 
  Coins, 
  AlertOctagon, 
  ShieldCheck, 
  UserX 
} from 'lucide-react';
import type { HouseStats } from '../types/bigboss';

interface HouseStatisticsProps {
  stats: HouseStats;
  totalContestants: number;
}

export const HouseStatistics: React.FC<HouseStatisticsProps> = ({ stats, totalContestants }) => {
  const statItems = [
    {
      label: 'ACTIVE CONTESTANTS',
      value: `${stats.activeCount}/${totalContestants}`,
      sub: `${stats.evictedCount} Evicted`,
      icon: Users,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      bgGlow: 'from-emerald-950/20 to-zinc-950',
    },
    {
      label: 'HIGHEST SCORER',
      value: stats.highestScorer ? `${stats.highestScorer.points} PTS` : 'N/A',
      sub: stats.highestScorer ? stats.highestScorer.name : 'No Active Leader',
      icon: Trophy,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      bgGlow: 'from-amber-950/20 to-zinc-950',
    },
    {
      label: 'TOTAL HOUSE POINTS',
      value: stats.totalPoints.toLocaleString(),
      sub: 'Cumulative score pool',
      icon: Coins,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
      bgGlow: 'from-cyan-950/20 to-zinc-950',
    },
    {
      label: 'CURRENT NOMINEES',
      value: stats.nominatedCount,
      sub: stats.nominatedCount > 0 ? 'Facing public eviction' : 'No active danger',
      icon: AlertOctagon,
      color: stats.nominatedCount > 0 ? 'text-rose-400' : 'text-zinc-400',
      borderColor: stats.nominatedCount > 0 ? 'border-rose-500/40' : 'border-zinc-800',
      bgGlow: stats.nominatedCount > 0 ? 'from-rose-950/25 to-zinc-950' : 'from-zinc-900/30 to-zinc-950',
    },
    {
      label: 'IMMUNE CONTESTANTS',
      value: stats.immuneCount,
      sub: 'Shielded from voting',
      icon: ShieldCheck,
      color: 'text-teal-400',
      borderColor: 'border-teal-500/30',
      bgGlow: 'from-teal-950/20 to-zinc-950',
    },
    {
      label: 'EVICTED CONTESTANTS',
      value: stats.evictedCount,
      sub: stats.evictedCount > 0 ? 'Eliminated from house' : 'Full strength house',
      icon: UserX,
      color: stats.evictedCount > 0 ? 'text-red-400' : 'text-zinc-500',
      borderColor: stats.evictedCount > 0 ? 'border-red-600/40' : 'border-zinc-800',
      bgGlow: stats.evictedCount > 0 ? 'from-red-950/25 to-zinc-950' : 'from-zinc-900/30 to-zinc-950',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {statItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className={`rounded-2xl border ${item.borderColor} bg-gradient-to-br ${item.bgGlow} p-4 backdrop-blur-xl shadow-lg relative overflow-hidden group hover:border-zinc-600 transition-all duration-200`}
          >
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[10px] font-heading font-bold text-zinc-400 tracking-wider uppercase truncate">
                {item.label}
              </span>
              <Icon className={`w-4 h-4 ${item.color} shrink-0 opacity-80 group-hover:scale-110 transition-transform`} />
            </div>

            <div className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${item.color}`}>
              {item.value}
            </div>

            <div className="text-[11px] text-zinc-500 font-sans mt-0.5 truncate">
              {item.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
};
