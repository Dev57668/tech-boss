import React from 'react';
import { Users, Trophy, Flame, AlertOctagon, ShieldCheck, UserX } from 'lucide-react';
import type { HouseStats } from '../types/bigboss';

interface HouseStatisticsProps {
  stats: HouseStats;
  totalContestants: number;
}

export const HouseStatistics: React.FC<HouseStatisticsProps> = ({ stats, totalContestants }) => {
  const cards = [
    {
      label: 'Active Housemates',
      value: `${stats.activeCount}`,
      subvalue: `/${totalContestants} Total`,
      note: `${stats.evictedCount} eliminated`,
      icon: Users,
      badge: 'HOUSE POPULATION',
      badgeClass: 'bg-[#f4f4ee] text-[#0d0e10]',
      highlight: false,
    },
    {
      label: 'House Leader',
      value: stats.highestScorer ? `${stats.highestScorer.points}` : '0',
      subvalue: 'PTS',
      note: stats.highestScorer ? stats.highestScorer.name : 'No leader',
      icon: Trophy,
      badge: 'HIGHEST SCORER',
      badgeClass: 'bg-[#d4ff3a] text-[#0d0e10] font-black',
      highlight: true,
    },
    {
      label: 'Total House Points',
      value: `${stats.totalPoints}`,
      subvalue: 'PTS',
      note: `Avg ${stats.activeCount ? Math.round(stats.totalPoints / stats.activeCount) : 0} per housemate`,
      icon: Flame,
      badge: 'HOUSE POOL',
      badgeClass: 'bg-[#f4f4ee] text-[#0d0e10]',
      highlight: false,
    },
    {
      label: 'Current Nominees',
      value: `${stats.nominatedCount}`,
      subvalue: 'IN DANGER',
      note: 'Vulnerable to eviction',
      icon: AlertOctagon,
      badge: 'DANGER ZONE',
      badgeClass: stats.nominatedCount > 0 ? 'bg-rose-100 text-rose-800' : 'bg-[#f4f4ee] text-[#75766f]',
      highlight: false,
    },
    {
      label: 'Immune Shielded',
      value: `${stats.immuneCount}`,
      subvalue: 'PROTECTED',
      note: 'Cannot be nominated',
      icon: ShieldCheck,
      badge: 'IMMUNITY',
      badgeClass: 'bg-emerald-100 text-emerald-800',
      highlight: false,
    },
    {
      label: 'Evicted Housemates',
      value: `${stats.evictedCount}`,
      subvalue: 'OUT',
      note: 'Irrevocably eliminated',
      icon: UserX,
      badge: 'EVICTION',
      badgeClass: 'bg-[#0d0e10] text-[#ffffff]',
      highlight: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`rounded-3xl p-4 sm:p-5 transition-all duration-200 border flex flex-col justify-between ${
              card.highlight
                ? 'bg-[#ffffff] border-[#0d0e10] shadow-[0_8px_30px_rgba(0,0,0,0.06)]'
                : 'bg-[#ffffff] border-[#dcdcd3] hover:border-[#b0b0a4]'
            }`}
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-1 mb-3">
              <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${card.badgeClass}`}>
                {card.badge}
              </span>
              <div className="p-1.5 rounded-full bg-[#f4f4ee] text-[#0d0e10]">
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Metrics */}
            <div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-[#0d0e10] tracking-tight flex items-baseline gap-1">
                <span>{card.value}</span>
                <span className="text-xs font-sans font-bold text-[#75766f]">{card.subvalue}</span>
              </div>
              <div className="text-xs text-[#75766f] font-medium mt-1 truncate">
                {card.note}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
