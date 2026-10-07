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
  Users
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

  const handlePointChange = (id: string, amount: number) => {
    if (amount > 0) {
      sound.play('points_up');
    } else {
      sound.play('points_down');
    }
    onAddPoints(id, amount);
  };

  return (
    <div className="space-y-4">
      {/* Control bar: Filters, Search & View Toggle */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-md">
        
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterTab === 'all'
                ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                : 'bg-zinc-800/70 text-zinc-400 hover:text-white hover:bg-zinc-800'
            } focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none`}
          >
            All ({contestants.length})
          </button>
          <button
            onClick={() => setFilterTab('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterTab === 'active'
                ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'bg-zinc-800/70 text-zinc-400 hover:text-white hover:bg-zinc-800'
            } focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none`}
          >
            Active ({contestants.filter((c) => c.status === 'Active').length})
          </button>
          <button
            onClick={() => setFilterTab('nominated')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterTab === 'nominated'
                ? 'bg-rose-600 text-white shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                : 'bg-zinc-800/70 text-zinc-400 hover:text-white hover:bg-zinc-800'
            } focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none`}
          >
            Nominated ({contestants.filter((c) => c.isNominated && c.status === 'Active').length})
          </button>
          <button
            onClick={() => setFilterTab('immune')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterTab === 'immune'
                ? 'bg-cyan-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'bg-zinc-800/70 text-zinc-400 hover:text-white hover:bg-zinc-800'
            } focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none`}
          >
            Immune ({contestants.filter((c) => c.isImmune && c.status === 'Active').length})
          </button>
          <button
            onClick={() => setFilterTab('evicted')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterTab === 'evicted'
                ? 'bg-zinc-700 text-white'
                : 'bg-zinc-800/70 text-zinc-400 hover:text-white hover:bg-zinc-800'
            } focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none`}
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
            aria-label="Filter by Team"
            className="px-2.5 py-1.5 rounded-xl bg-zinc-800/90 border border-zinc-700 text-xs font-medium text-zinc-300 focus:outline-none focus:border-red-500"
          >
            <option value="all">All Teams</option>
            <option value="Tigers">Team Tigers</option>
            <option value="Wolves">Team Wolves</option>
          </select>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contestant..."
              aria-label="Search contestants"
              className="w-32 sm:w-44 pl-8 pr-3 py-1.5 rounded-xl bg-zinc-800/90 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Card / Table Toggle */}
          <div className="flex items-center p-0.5 rounded-xl bg-zinc-800 border border-zinc-700">
            <button
              onClick={() => setViewMode('cards')}
              title="Card View"
              aria-label="Card View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'cards' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
              } focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="Table View"
              aria-label="Table View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
              } focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none`}
            >
              <ListFilter className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Empty State if filter yields zero */}
      {filteredContestants.length === 0 ? (
        <div className="py-10 px-4 rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 text-center flex flex-col items-center justify-center">
          <Users className="w-6 h-6 text-zinc-600 mb-2" />
          <h4 className="text-sm font-bold text-zinc-300">No Contestants Found</h4>
          <p className="text-xs text-zinc-500 max-w-sm mt-0.5">
            No housemates match the selected filter criteria or search keyword.
          </p>
        </div>
      ) : viewMode === 'cards' ? (
        /* Card Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredContestants.map((c) => {
            const isEvicted = c.status === 'Evicted';

            return (
              <div
                key={c.id}
                className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${
                  c.isCaptain
                    ? 'border-amber-500/50 bg-gradient-to-br from-amber-950/20 via-zinc-900/80 to-[#12110c] shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                    : isEvicted
                    ? 'border-zinc-800/60 bg-zinc-950/50 opacity-60'
                    : c.isNominated
                    ? 'border-rose-900/50 bg-gradient-to-br from-rose-950/15 via-zinc-900/80 to-zinc-950'
                    : 'border-zinc-800/80 bg-zinc-900/70 hover:border-zinc-700'
                } backdrop-blur-md`}
              >
                {/* Top Section: Avatar, Info, Points */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  
                  {/* Left: Avatar + Details */}
                  <div className="flex items-center gap-3.5">
                    {/* Avatar Initials */}
                    <div className="relative">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-heading text-lg font-bold shadow-md bg-gradient-to-br ${
                          c.isCaptain
                            ? 'from-amber-400 to-yellow-600 text-black ring-2 ring-amber-400/50'
                            : isEvicted
                            ? 'from-zinc-700 to-zinc-800 text-zinc-400'
                            : c.avatarColor + ' text-white'
                        }`}
                      >
                        {c.name.substring(0, 2).toUpperCase()}
                      </div>

                      {c.isCaptain && (
                        <div className="absolute -top-2 -right-2 p-1 rounded-full bg-amber-400 text-black shadow-md">
                          <Crown className="w-3 h-3 fill-black" />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`text-base font-extrabold tracking-tight ${isEvicted ? 'line-through text-zinc-400' : 'text-white'}`}>
                          {c.name}
                        </h4>
                        
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            c.team === 'Tigers'
                              ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                              : 'bg-indigo-950/60 text-indigo-400 border border-indigo-800/40'
                          }`}
                        >
                          Team {c.team}
                        </span>
                      </div>

                      {/* Status Badges Row */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        {c.isCaptain && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                            <Crown className="w-2.5 h-2.5 fill-amber-400" />
                            CAPTAIN
                          </span>
                        )}

                        {c.isImmune && !c.isCaptain && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[10px] font-bold uppercase">
                            <ShieldCheck className="w-3 h-3" />
                            IMMUNE
                          </span>
                        )}

                        {c.isNominated && !isEvicted && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[10px] font-bold uppercase animate-pulse">
                            <AlertOctagon className="w-3 h-3" />
                            NOMINATED
                          </span>
                        )}

                        {isEvicted && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 text-[10px] font-bold uppercase">
                            <UserX className="w-3 h-3" />
                            EVICTED
                          </span>
                        )}

                        {!c.isNominated && !c.isImmune && !c.isCaptain && !isEvicted && (
                          <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-medium">
                            SAFE
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Points counter */}
                  <div className="text-right shrink-0">
                    <div className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
                      {c.points}
                      <span className="text-[10px] font-semibold text-zinc-400 ml-1">PTS</span>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500">
                      Status: {c.status}
                    </span>
                  </div>

                </div>

                {/* Point Actions Section */}
                <div className="pt-3 border-t border-zinc-800/80">
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      Point Adjustments:
                    </span>
                    <button
                      onClick={() => onOpenCustomPoints(c)}
                      disabled={isEvicted}
                      title={isEvicted ? 'Contestant is evicted' : 'Custom point decree'}
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded transition-colors ${
                        isEvicted
                          ? 'opacity-40 cursor-not-allowed bg-zinc-800 text-zinc-500'
                          : 'text-red-400 hover:text-red-300 bg-red-950/40 border border-red-800/40 hover:bg-red-900/40 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none'
                      }`}
                    >
                      <Zap className="w-3 h-3" />
                      Custom...
                    </button>
                  </div>

                  <div className="grid grid-cols-6 gap-1.5">
                    {/* Add points */}
                    <button
                      onClick={() => handlePointChange(c.id, 10)}
                      disabled={isEvicted}
                      title={isEvicted ? 'Contestant is evicted' : 'Award +10 PTS'}
                      className="px-2 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-700/40 text-emerald-300 text-xs font-mono font-bold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => handlePointChange(c.id, 25)}
                      disabled={isEvicted}
                      title={isEvicted ? 'Contestant is evicted' : 'Award +25 PTS'}
                      className="px-2 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-700/40 text-emerald-300 text-xs font-mono font-bold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                    >
                      +25
                    </button>
                    <button
                      onClick={() => handlePointChange(c.id, 50)}
                      disabled={isEvicted}
                      title={isEvicted ? 'Contestant is evicted' : 'Award +50 PTS'}
                      className="px-2 py-1.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/70 border border-emerald-600/50 text-emerald-200 text-xs font-mono font-bold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                    >
                      +50
                    </button>

                    {/* Deduct points */}
                    <button
                      onClick={() => handlePointChange(c.id, -10)}
                      disabled={isEvicted}
                      title={isEvicted ? 'Contestant is evicted' : 'Deduct -10 PTS'}
                      className="px-2 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-700/40 text-rose-300 text-xs font-mono font-bold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
                    >
                      -10
                    </button>
                    <button
                      onClick={() => handlePointChange(c.id, -25)}
                      disabled={isEvicted}
                      title={isEvicted ? 'Contestant is evicted' : 'Deduct -25 PTS'}
                      className="px-2 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-700/40 text-rose-300 text-xs font-mono font-bold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
                    >
                      -25
                    </button>
                    <button
                      onClick={() => handlePointChange(c.id, -50)}
                      disabled={isEvicted}
                      title={isEvicted ? 'Contestant is evicted' : 'Deduct -50 PTS'}
                      className="px-2 py-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/70 border border-rose-600/50 text-rose-200 text-xs font-mono font-bold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
                    >
                      -50
                    </button>
                  </div>
                </div>

                {/* Status Toggle Actions */}
                <div className="pt-3 mt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Nominate Action */}
                    <button
                      onClick={() => onToggleNomination(c.id)}
                      disabled={isEvicted}
                      title={
                        isEvicted
                          ? 'Contestant is evicted'
                          : c.isImmune && !c.isNominated
                          ? 'Immune contestants cannot be nominated'
                          : c.isNominated
                          ? 'Revoke nomination'
                          : 'Nominate for eviction'
                      }
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        c.isNominated
                          ? 'bg-rose-950 border border-rose-600 text-rose-300'
                          : c.isImmune
                          ? 'bg-zinc-800/60 border border-zinc-700/60 text-zinc-500'
                          : 'bg-zinc-800/90 hover:bg-zinc-700 border border-zinc-700 text-zinc-300'
                      } ${isEvicted ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'} focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none`}
                    >
                      <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                      <span>{c.isNominated ? 'Un-nominate' : 'Nominate'}</span>
                    </button>

                    {/* Immunity Action */}
                    <button
                      onClick={() => onToggleImmunity(c.id)}
                      disabled={isEvicted || c.isCaptain}
                      title={
                        isEvicted
                          ? 'Contestant is evicted'
                          : c.isCaptain
                          ? 'Captain has permanent immunity'
                          : c.isImmune
                          ? 'Revoke immunity'
                          : 'Grant immunity'
                      }
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        c.isImmune
                          ? 'bg-cyan-950 border border-cyan-500 text-cyan-300'
                          : 'bg-zinc-800/90 hover:bg-zinc-700 border border-zinc-700 text-zinc-300'
                      } ${isEvicted || c.isCaptain ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'} focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{c.isImmune ? 'Revoke Immunity' : 'Grant Immunity'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Captain Toggle */}
                    {!c.isCaptain && !isEvicted && (
                      <button
                        onClick={() => onSetCaptain(c.id)}
                        title="Crown as Captain"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 border border-amber-600/40 text-amber-300 text-xs font-bold transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
                      >
                        <Crown className="w-3.5 h-3.5 fill-amber-400" />
                        <span>Make Captain</span>
                      </button>
                    )}

                    {/* REQUIREMENT: Evict Button with Confirmation Modal on every active contestant row */}
                    {!isEvicted && (
                      <button
                        onClick={() => onRequestEviction(c)}
                        title="Evict contestant from the house"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-black bg-red-950/60 hover:bg-red-900 border border-red-700/60 text-red-300 hover:text-white transition-all active:scale-95 shadow-sm focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        <span>Evict</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Professional Table View */
        <div className="overflow-x-auto rounded-2xl border border-zinc-800/80 bg-zinc-900/70 backdrop-blur-md shadow-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/70 text-zinc-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-4">Contestant</th>
                <th className="py-3 px-3">Team</th>
                <th className="py-3 px-3">Points</th>
                <th className="py-3 px-3">Status Badges</th>
                <th className="py-3 px-3">Points Action</th>
                <th className="py-3 px-4 text-right">House Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredContestants.map((c) => {
                const isEvicted = c.status === 'Evicted';

                return (
                  <tr
                    key={c.id}
                    className={`transition-colors ${
                      isEvicted
                        ? 'bg-zinc-950/40 opacity-60'
                        : c.isCaptain
                        ? 'bg-amber-950/10 hover:bg-amber-950/20'
                        : 'hover:bg-zinc-800/40'
                    }`}
                  >
                    {/* Contestant info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                            c.isCaptain
                              ? 'bg-amber-400 text-black'
                              : isEvicted
                              ? 'bg-zinc-800 text-zinc-500'
                              : c.avatarColor + ' text-white'
                          }`}
                        >
                          {c.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className={`font-bold ${isEvicted ? 'line-through text-zinc-500' : 'text-white'}`}>
                            {c.name}
                          </div>
                          <div className="text-[10px] text-zinc-500 font-mono">
                            ID: {c.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Team */}
                    <td className="py-3 px-3 font-medium">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.team === 'Tigers'
                            ? 'bg-amber-950/50 text-amber-400'
                            : 'bg-indigo-950/50 text-indigo-400'
                        }`}
                      >
                        {c.team}
                      </span>
                    </td>

                    {/* Points */}
                    <td className="py-3 px-3 font-mono font-extrabold text-sm text-white">
                      {c.points} <span className="text-[10px] font-normal text-zinc-500">PTS</span>
                    </td>

                    {/* Badges */}
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap items-center gap-1">
                        {c.isCaptain && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[9px] font-bold">
                            CAPTAIN
                          </span>
                        )}
                        {c.isImmune && !c.isCaptain && (
                          <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-bold">
                            IMMUNE
                          </span>
                        )}
                        {c.isNominated && !isEvicted && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[9px] font-bold">
                            NOMINATED
                          </span>
                        )}
                        {isEvicted && (
                          <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[9px] font-bold">
                            EVICTED
                          </span>
                        )}
                        {!c.isCaptain && !c.isImmune && !c.isNominated && !isEvicted && (
                          <span className="text-[10px] text-zinc-500">Safe</span>
                        )}
                      </div>
                    </td>

                    {/* Point adjustments */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handlePointChange(c.id, 10)}
                          disabled={isEvicted}
                          title={isEvicted ? 'Contestant is evicted' : 'Award +10'}
                          className="px-1.5 py-1 rounded bg-emerald-950/40 hover:bg-emerald-900 border border-emerald-700/40 text-emerald-300 text-[10px] font-mono font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handlePointChange(c.id, -10)}
                          disabled={isEvicted}
                          title={isEvicted ? 'Contestant is evicted' : 'Deduct -10'}
                          className="px-1.5 py-1 rounded bg-rose-950/40 hover:bg-rose-900 border border-rose-700/40 text-rose-300 text-[10px] font-mono font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          -10
                        </button>
                        <button
                          onClick={() => onOpenCustomPoints(c)}
                          disabled={isEvicted}
                          title={isEvicted ? 'Contestant is evicted' : 'Custom points'}
                          className="px-1.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-[10px] font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          ...
                        </button>
                      </div>
                    </td>

                    {/* House Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onToggleNomination(c.id)}
                          disabled={isEvicted}
                          title={
                            isEvicted
                              ? 'Contestant is evicted'
                              : c.isImmune && !c.isNominated
                              ? 'Immune contestants cannot be nominated'
                              : 'Nominate / Save'
                          }
                          className={`p-1.5 rounded-lg border text-xs transition-colors ${
                            c.isNominated
                              ? 'bg-rose-950 border-rose-600 text-rose-300'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
                          } disabled:opacity-40 disabled:cursor-not-allowed`}
                        >
                          <AlertOctagon className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onToggleImmunity(c.id)}
                          disabled={isEvicted || c.isCaptain}
                          title={
                            isEvicted
                              ? 'Contestant is evicted'
                              : c.isCaptain
                              ? 'Captain has immunity'
                              : 'Toggle Immunity'
                          }
                          className={`p-1.5 rounded-lg border text-xs transition-colors ${
                            c.isImmune
                              ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
                          } disabled:opacity-40 disabled:cursor-not-allowed`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </button>

                        {!c.isCaptain && !isEvicted && (
                          <button
                            onClick={() => onSetCaptain(c.id)}
                            title="Crown as Captain"
                            className="p-1.5 rounded-lg bg-amber-950/40 border border-amber-600/40 text-amber-300 hover:bg-amber-900 transition-colors"
                          >
                            <Crown className="w-3.5 h-3.5 fill-amber-400" />
                          </button>
                        )}

                        {!isEvicted && (
                          <button
                            onClick={() => onRequestEviction(c)}
                            title="Evict contestant"
                            className="px-2 py-1 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-700/60 text-red-300 text-[10px] font-bold"
                          >
                            Evict
                          </button>
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
    </div>
  );
};
