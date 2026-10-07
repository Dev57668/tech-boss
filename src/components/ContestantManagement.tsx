import React, { useState } from 'react';
import { 
  Crown, 
  ShieldCheck, 
  AlertOctagon, 
  UserX, 
  LayoutGrid, 
  ListFilter, 
  Search,
  Zap,
  Lock,
  Plus,
  Minus
} from 'lucide-react';
import type { Contestant } from '../types/bigboss';
import { sound } from '../utils/sound';

interface ContestantManagementProps {
  contestants: Contestant[];
  onAddPoints: (contestantId: string, amount: number) => void;
  onToggleNomination: (contestantId: string) => void;
  onToggleImmunity: (contestantId: string) => void;
  onRequestEviction: (contestant: Contestant) => void;
  onSetCaptain: (contestantId: string) => void;
  onOpenCustomPoints: (contestant: Contestant) => void;
}

export const ContestantManagement: React.FC<ContestantManagementProps> = ({
  contestants,
  onAddPoints,
  onToggleNomination,
  onToggleImmunity,
  onRequestEviction,
  onSetCaptain,
  onOpenCustomPoints,
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'nominated' | 'immune' | 'evicted'>('active');
  const [teamFilter, setTeamFilter] = useState<'all' | 'Tigers' | 'Wolves'>('all');

  const filteredContestants = contestants.filter((c) => {
    // Search query
    if (searchQuery.trim() && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Tab filter
    if (filterTab === 'active' && c.status !== 'Active') return false;
    if (filterTab === 'nominated' && (!c.isNominated || c.status === 'Evicted')) return false;
    if (filterTab === 'immune' && (!c.isImmune || c.status === 'Evicted')) return false;
    if (filterTab === 'evicted' && c.status !== 'Evicted') return false;

    // Team filter
    if (teamFilter !== 'all' && c.team !== teamFilter) return false;

    return true;
  });

  const handlePointChange = (c: Contestant, amount: number) => {
    if (c.status === 'Evicted') return;
    if (amount > 0) {
      sound.play('points_up');
    } else {
      sound.play('points_down');
    }
    onAddPoints(c.id, amount);
  };

  return (
    <div id="section-housemates" className="space-y-4">
      {/* Control bar: Filters, Search & View Toggle */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-3xl bg-[#ffffff] border border-[#dcdcd3] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterTab('active')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              filterTab === 'active'
                ? 'bg-[#0d0e10] text-[#ffffff] shadow-sm'
                : 'bg-[#f4f4ee] text-[#75766f] hover:text-[#0d0e10]'
            }`}
          >
            Active ({contestants.filter((c) => c.status === 'Active').length})
          </button>
          <button
            onClick={() => setFilterTab('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              filterTab === 'all'
                ? 'bg-[#0d0e10] text-[#ffffff] shadow-sm'
                : 'bg-[#f4f4ee] text-[#75766f] hover:text-[#0d0e10]'
            }`}
          >
            All ({contestants.length})
          </button>
          <button
            onClick={() => setFilterTab('nominated')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              filterTab === 'nominated'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-[#f4f4ee] text-[#75766f] hover:text-[#0d0e10]'
            }`}
          >
            Nominated ({contestants.filter((c) => c.isNominated && c.status === 'Active').length})
          </button>
          <button
            onClick={() => setFilterTab('immune')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              filterTab === 'immune'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-[#f4f4ee] text-[#75766f] hover:text-[#0d0e10]'
            }`}
          >
            Immune ({contestants.filter((c) => c.isImmune && c.status === 'Active').length})
          </button>
          <button
            onClick={() => setFilterTab('evicted')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              filterTab === 'evicted'
                ? 'bg-[#75766f] text-white'
                : 'bg-[#f4f4ee] text-[#75766f] hover:text-[#0d0e10]'
            }`}
          >
            Evicted ({contestants.filter((c) => c.status === 'Evicted').length})
          </button>
        </div>

        {/* Search, Team Select & View Mode Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Team Filter */}
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value as 'all' | 'Tigers' | 'Wolves')}
            className="px-3 py-1.5 rounded-full bg-[#f4f4ee] border border-[#dcdcd3] text-xs font-bold text-[#0d0e10] focus:outline-none focus:ring-1 focus:ring-[#0d0e10]"
          >
            <option value="all">All Teams</option>
            <option value="Tigers">Team Tigers</option>
            <option value="Wolves">Team Wolves</option>
          </select>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#75766f] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search housemate..."
              className="w-32 sm:w-44 pl-8 pr-3 py-1.5 rounded-full bg-[#f4f4ee] border border-[#dcdcd3] text-xs text-[#0d0e10] placeholder-[#75766f] focus:outline-none focus:ring-1 focus:ring-[#0d0e10]"
            />
          </div>

          {/* Card / Table Toggle */}
          <div className="flex items-center p-1 rounded-full bg-[#f4f4ee] border border-[#dcdcd3]">
            <button
              onClick={() => setViewMode('cards')}
              title="Card View"
              className={`p-1.5 rounded-full transition-colors ${
                viewMode === 'cards' ? 'bg-[#ffffff] text-[#0d0e10] shadow-sm' : 'text-[#75766f] hover:text-[#0d0e10]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`p-1.5 rounded-full transition-colors ${
                viewMode === 'table' ? 'bg-[#ffffff] text-[#0d0e10] shadow-sm' : 'text-[#75766f] hover:text-[#0d0e10]'
              }`}
            >
              <ListFilter className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* View Content: Cards or Table */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredContestants.map((c) => {
            const isEvicted = c.status === 'Evicted';

            return (
              <div
                key={c.id}
                className={`rounded-3xl border p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between ${
                  c.isCaptain
                    ? 'border-[#0d0e10] bg-[#ffffff] shadow-[0_8px_30px_rgba(0,0,0,0.06)] ring-2 ring-[#d4ff3a]'
                    : isEvicted
                    ? 'border-[#dcdcd3] bg-[#f8f8f4] opacity-60'
                    : c.isNominated
                    ? 'border-rose-300 bg-[#fffdfd]'
                    : 'border-[#dcdcd3] bg-[#ffffff] hover:border-[#b0b0a4]'
                }`}
              >
                {/* Top Section: Avatar, Info, Points */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    {/* Left: Avatar + Details */}
                    <div className="flex items-center gap-3.5">
                      <div className="relative">
                        <div
                          className={`w-13 h-13 rounded-2xl flex items-center justify-center font-heading text-lg font-black shadow-sm ${
                            c.isCaptain
                              ? 'bg-[#0d0e10] text-[#d4ff3a]'
                              : isEvicted
                              ? 'bg-[#dcdcd3] text-[#75766f]'
                              : `bg-gradient-to-br ${c.avatarColor} text-white`
                          }`}
                        >
                          {c.name.substring(0, 2).toUpperCase()}
                        </div>

                        {c.isCaptain && (
                          <div className="absolute -top-2 -right-2 p-1 rounded-full bg-[#d4ff3a] text-[#0d0e10] shadow-sm">
                            <Crown className="w-3 h-3 fill-[#0d0e10]" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`text-lg font-black tracking-tight ${isEvicted ? 'line-through text-[#75766f]' : 'text-[#0d0e10]'}`}>
                            {c.name}
                          </h4>
                          
                          <span
                            className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                              c.team === 'Tigers'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-indigo-100 text-indigo-900'
                            }`}
                          >
                            {c.team}
                          </span>
                        </div>

                        {/* Status Badges Row */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          {c.isCaptain && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d4ff3a] text-[#0d0e10] text-[10px] font-black uppercase">
                              <Crown className="w-2.5 h-2.5 fill-[#0d0e10]" />
                              CAPTAIN
                            </span>
                          )}

                          {c.isImmune && !c.isCaptain && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                              <ShieldCheck className="w-3 h-3" />
                              IMMUNE
                            </span>
                          )}

                          {c.isNominated && !isEvicted && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase animate-pulse">
                              <AlertOctagon className="w-3 h-3" />
                              NOMINATED
                            </span>
                          )}

                          {isEvicted && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0d0e10] text-white text-[10px] font-bold uppercase">
                              <UserX className="w-3 h-3" />
                              EVICTED
                            </span>
                          )}

                          {!c.isNominated && !c.isImmune && !c.isCaptain && !isEvicted && (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#f4f4ee] text-[#75766f] text-[10px] font-semibold">
                              SAFE
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Points counter */}
                    <div className="text-right shrink-0">
                      <div className="text-2xl sm:text-3xl font-black font-mono text-[#0d0e10] tracking-tight">
                        {c.points}
                        <span className="text-xs font-sans font-bold text-[#75766f] ml-1">PTS</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#75766f]">
                        {c.status}
                      </span>
                    </div>
                  </div>

                  {/* Point Adjustments Pill Buttons */}
                  <div className="pt-3 border-t border-[#eeeee8]">
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[11px] font-mono uppercase font-bold text-[#75766f] flex items-center gap-1">
                        {isEvicted && <Lock className="w-3 h-3 text-[#75766f]" />}
                        Point Adjustments
                      </span>
                      <button
                        onClick={() => onOpenCustomPoints(c)}
                        disabled={isEvicted}
                        className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full transition-all ${
                          isEvicted
                            ? 'bg-[#f4f4ee] text-[#b0b0a4] cursor-not-allowed'
                            : 'bg-[#d4ff3a] hover:bg-[#c4f228] text-[#0d0e10]'
                        }`}
                        title={isEvicted ? 'Evicted contestants cannot receive points' : 'Custom points decree'}
                      >
                        <Zap className="w-3 h-3" />
                        <span>Custom...</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-6 gap-1.5">
                      {/* Add points */}
                      <button
                        onClick={() => handlePointChange(c, 10)}
                        disabled={isEvicted}
                        className="py-1.5 rounded-full bg-[#f4f4ee] hover:bg-[#d4ff3a] hover:text-[#0d0e10] text-[#0d0e10] text-xs font-mono font-bold transition-all text-center disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        +10
                      </button>
                      <button
                        onClick={() => handlePointChange(c, 25)}
                        disabled={isEvicted}
                        className="py-1.5 rounded-full bg-[#f4f4ee] hover:bg-[#d4ff3a] hover:text-[#0d0e10] text-[#0d0e10] text-xs font-mono font-bold transition-all text-center disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        +25
                      </button>
                      <button
                        onClick={() => handlePointChange(c, 50)}
                        disabled={isEvicted}
                        className="py-1.5 rounded-full bg-[#f4f4ee] hover:bg-[#d4ff3a] hover:text-[#0d0e10] text-[#0d0e10] text-xs font-mono font-bold transition-all text-center disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        +50
                      </button>

                      {/* Deduct points */}
                      <button
                        onClick={() => handlePointChange(c, -10)}
                        disabled={isEvicted}
                        className="py-1.5 rounded-full bg-[#f4f4ee] hover:bg-rose-100 hover:text-rose-900 text-[#0d0e10] text-xs font-mono font-bold transition-all text-center disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        -10
                      </button>
                      <button
                        onClick={() => handlePointChange(c, -25)}
                        disabled={isEvicted}
                        className="py-1.5 rounded-full bg-[#f4f4ee] hover:bg-rose-100 hover:text-rose-900 text-[#0d0e10] text-xs font-mono font-bold transition-all text-center disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        -25
                      </button>
                      <button
                        onClick={() => handlePointChange(c, -50)}
                        disabled={isEvicted}
                        className="py-1.5 rounded-full bg-[#f4f4ee] hover:bg-rose-100 hover:text-rose-900 text-[#0d0e10] text-xs font-mono font-bold transition-all text-center disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        -50
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status Toggle Actions */}
                <div className="pt-4 mt-4 border-t border-[#eeeee8] flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Nominate Action */}
                    <button
                      onClick={() => onToggleNomination(c.id)}
                      disabled={isEvicted}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        isEvicted
                          ? 'bg-[#f4f4ee] text-[#b0b0a4] cursor-not-allowed'
                          : c.isNominated
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-[#f4f4ee] hover:bg-[#e6e6dc] text-[#0d0e10]'
                      }`}
                      title={
                        isEvicted
                          ? 'Cannot nominate evicted contestant'
                          : c.isImmune
                          ? 'Contestant is immune from nominations'
                          : c.isNominated
                          ? 'Revoke nomination'
                          : 'Nominate contestant'
                      }
                    >
                      <AlertOctagon className="w-3.5 h-3.5" />
                      <span>{c.isNominated ? 'Un-nominate' : 'Nominate'}</span>
                    </button>

                    {/* Immunity Action */}
                    <button
                      onClick={() => onToggleImmunity(c.id)}
                      disabled={isEvicted}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        isEvicted
                          ? 'bg-[#f4f4ee] text-[#b0b0a4] cursor-not-allowed'
                          : c.isImmune
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-[#f4f4ee] hover:bg-[#e6e6dc] text-[#0d0e10]'
                      }`}
                      title={isEvicted ? 'Cannot grant immunity to evicted contestant' : 'Toggle immunity shield'}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{c.isImmune ? 'Revoke Immunity' : 'Grant Immunity'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Captain Toggle */}
                    {!c.isCaptain && !isEvicted && (
                      <button
                        onClick={() => onSetCaptain(c.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#f4f4ee] hover:bg-[#d4ff3a] hover:text-[#0d0e10] text-[#0d0e10] text-xs font-bold transition-all"
                        title="Crown as House Captain"
                      >
                        <Crown className="w-3.5 h-3.5" />
                        <span>Make Captain</span>
                      </button>
                    )}

                    {/* Evict Trigger (Opens confirmation modal) */}
                    {!isEvicted ? (
                      <button
                        onClick={() => onRequestEviction(c)}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#0d0e10] hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                        title="Evict contestant from House"
                      >
                        <UserX className="w-3.5 h-3.5 text-rose-400" />
                        <span>Evict</span>
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono text-[#75766f] px-3 py-1 rounded-full bg-[#f4f4ee]">
                        EVICTED (LOCKED)
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Professional Editorial Table View */
        <div className="overflow-x-auto rounded-3xl border border-[#dcdcd3] bg-[#ffffff] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#eeeee8] bg-[#f8f8f4] text-[#75766f] uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3.5 px-5">Housemate</th>
                <th className="py-3.5 px-3">Team</th>
                <th className="py-3.5 px-3 text-right">Points</th>
                <th className="py-3.5 px-3">Status Badges</th>
                <th className="py-3.5 px-3 text-center">Quick Adjust</th>
                <th className="py-3.5 px-5 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eeeee8]">
              {filteredContestants.map((c) => {
                const isEvicted = c.status === 'Evicted';

                return (
                  <tr
                    key={c.id}
                    className={`hover:bg-[#fcfcf9] transition-colors ${
                      c.isCaptain ? 'bg-[#d4ff3a]/10' : isEvicted ? 'bg-[#f8f8f4] opacity-60' : ''
                    }`}
                  >
                    {/* Contestant */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            c.isCaptain
                              ? 'bg-[#0d0e10] text-[#d4ff3a]'
                              : isEvicted
                              ? 'bg-[#dcdcd3] text-[#75766f]'
                              : 'bg-[#0d0e10] text-white'
                          }`}
                        >
                          {c.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className={`font-bold text-sm ${isEvicted ? 'line-through text-[#75766f]' : 'text-[#0d0e10]'}`}>
                            {c.name}
                          </div>
                          <div className="text-[10px] text-[#75766f] font-mono">{c.status}</div>
                        </div>
                      </div>
                    </td>

                    {/* Team */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          c.team === 'Tigers'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-indigo-100 text-indigo-900'
                        }`}
                      >
                        {c.team}
                      </span>
                    </td>

                    {/* Points */}
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-base text-[#0d0e10]">
                      {c.points} <span className="text-[9px] text-[#75766f] font-sans">PTS</span>
                    </td>

                    {/* Status Badges */}
                    <td className="py-3.5 px-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {c.isCaptain && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d4ff3a] text-[#0d0e10] text-[9px] font-black uppercase">
                            <Crown className="w-2.5 h-2.5 fill-[#0d0e10]" />
                            CAPTAIN
                          </span>
                        )}
                        {c.isImmune && !c.isCaptain && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                            IMMUNE
                          </span>
                        )}
                        {c.isNominated && !isEvicted && (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[9px] font-bold">
                            NOMINATED
                          </span>
                        )}
                        {isEvicted && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#0d0e10] text-white text-[9px] font-bold">
                            EVICTED
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Quick Points */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handlePointChange(c, 10)}
                          disabled={isEvicted}
                          className="px-2 py-1 rounded-full bg-[#f4f4ee] hover:bg-[#d4ff3a] hover:text-[#0d0e10] text-[#0d0e10] text-[10px] font-mono font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handlePointChange(c, 25)}
                          disabled={isEvicted}
                          className="px-2 py-1 rounded-full bg-[#f4f4ee] hover:bg-[#d4ff3a] hover:text-[#0d0e10] text-[#0d0e10] text-[10px] font-mono font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          +25
                        </button>
                        <button
                          onClick={() => handlePointChange(c, -10)}
                          disabled={isEvicted}
                          className="px-2 py-1 rounded-full bg-[#f4f4ee] hover:bg-rose-100 hover:text-rose-900 text-[#0d0e10] text-[10px] font-mono font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          -10
                        </button>
                        <button
                          onClick={() => handlePointChange(c, -25)}
                          disabled={isEvicted}
                          className="px-2 py-1 rounded-full bg-[#f4f4ee] hover:bg-rose-100 hover:text-rose-900 text-[#0d0e10] text-[10px] font-mono font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          -25
                        </button>
                        <button
                          onClick={() => onOpenCustomPoints(c)}
                          disabled={isEvicted}
                          className="px-2.5 py-1 rounded-full bg-[#d4ff3a] hover:bg-[#c4f228] text-[#0d0e10] text-[10px] font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          ...
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onToggleNomination(c.id)}
                          disabled={isEvicted}
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            c.isNominated
                              ? 'bg-rose-600 text-white'
                              : 'bg-[#f4f4ee] hover:bg-[#e6e6dc] text-[#0d0e10]'
                          } disabled:opacity-30 disabled:cursor-not-allowed`}
                        >
                          {c.isNominated ? 'Un-nominate' : 'Nominate'}
                        </button>
                        <button
                          onClick={() => onToggleImmunity(c.id)}
                          disabled={isEvicted}
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            c.isImmune
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#f4f4ee] hover:bg-[#e6e6dc] text-[#0d0e10]'
                          } disabled:opacity-30 disabled:cursor-not-allowed`}
                        >
                          Immunity
                        </button>
                        {!isEvicted ? (
                          <button
                            onClick={() => onRequestEviction(c)}
                            className="px-3 py-1 rounded-full text-xs font-bold bg-[#0d0e10] hover:bg-rose-700 text-white uppercase tracking-wider"
                          >
                            Evict
                          </button>
                        ) : (
                          <span className="text-[10px] text-[#75766f] font-mono">
                            EVICTED
                          </span>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filteredContestants.length === 0 && (
        <div className="text-center py-12 rounded-3xl border border-[#dcdcd3] bg-[#ffffff] p-6 text-[#75766f]">
          No housemates match the selected filter criteria.
        </div>
      )}
    </div>
  );
};
