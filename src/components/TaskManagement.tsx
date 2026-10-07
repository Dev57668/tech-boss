import React, { useState, useRef } from 'react';
import { 
  CheckCircle2, 
  Award, 
  Plus, 
  Users, 
  CheckCheck
} from 'lucide-react';
import type { HouseTask, Contestant, TeamName } from '../types/bigboss';
import { sound } from '../utils/sound';

interface TaskManagementProps {
  tasks: HouseTask[];
  activeContestants: Contestant[];
  onCompleteTask: (taskId: string) => void;
  onAddTask: (task: Omit<HouseTask, 'id' | 'isCompleted'>) => void;
}

export const TaskManagement: React.FC<TaskManagementProps> = ({
  tasks,
  activeContestants,
  onCompleteTask,
  onAddTask,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isAdding, setIsAdding] = useState(false);

  // Guard against double clicks
  const completingRef = useRef<Set<string>>(new Set());

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<HouseTask['category']>('Luxury Budget');
  const [newPoints, setNewPoints] = useState<number>(30);
  const [newAssigneeType, setNewAssigneeType] = useState<'contestant' | 'team'>('team');
  const [selectedContestantId, setSelectedContestantId] = useState<string>(activeContestants[0]?.id || '');
  const [selectedTeam, setSelectedTeam] = useState<TeamName>('Tigers');

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.isCompleted;
    if (filter === 'completed') return t.isCompleted;
    return true;
  });

  const handleMarkComplete = (taskId: string) => {
    // Edge case check: Double-click lockout
    if (completingRef.current.has(taskId)) {
      return;
    }
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask || targetTask.isCompleted) {
      return;
    }

    completingRef.current.add(taskId);
    sound.play('crown');
    onCompleteTask(taskId);

    // Release after debounce window
    setTimeout(() => {
      completingRef.current.delete(taskId);
    }, 1000);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let assigneeName = '';
    let assignedContestantId: string | undefined = undefined;
    let assignedTeam: TeamName | undefined = undefined;

    if (newAssigneeType === 'contestant') {
      const contestant = activeContestants.find((c) => c.id === selectedContestantId);
      assigneeName = contestant ? contestant.name : 'Contestant';
      assignedContestantId = selectedContestantId;
    } else {
      assigneeName = `Team ${selectedTeam}`;
      assignedTeam = selectedTeam;
    }

    onAddTask({
      title: newTitle.trim(),
      description: newDescription.trim() || 'Official Big Boss House Challenge',
      category: newCategory,
      points: Math.max(5, Math.min(200, Number(newPoints) || 20)),
      assignedType: newAssigneeType,
      assignedName: assigneeName,
      assignedContestantId,
      assignedTeam,
    });

    setNewTitle('');
    setNewDescription('');
    setIsAdding(false);
  };

  const getCategoryBadge = (category: HouseTask['category']) => {
    switch (category) {
      case 'Luxury Budget':
        return 'bg-amber-950/60 border-amber-500/40 text-amber-300';
      case 'Captaincy':
        return 'bg-yellow-950/60 border-yellow-500/40 text-yellow-300';
      case 'Secret Mission':
        return 'bg-purple-950/60 border-purple-500/40 text-purple-300';
      case 'Ration':
        return 'bg-rose-950/60 border-rose-500/40 text-rose-300';
      case 'Discipline':
        return 'bg-blue-950/60 border-blue-500/40 text-blue-300';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/70 p-5 backdrop-blur-xl shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-950/60 border border-red-700/50 text-red-400">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-black text-base uppercase tracking-wider text-white flex items-center gap-2">
              TASK MANAGEMENT
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-normal">
                {tasks.filter((t) => !t.isCompleted).length} ACTIVE
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400">Execute house challenges, allocate reward points</p>
          </div>
        </div>

        {/* Filter Pills and Add Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 rounded-xl bg-zinc-800/90 border border-zinc-700/80 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                filter === 'all' ? 'bg-zinc-700 text-white shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                filter === 'pending' ? 'bg-amber-600 text-white shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Pending ({tasks.filter((t) => !t.isCompleted).length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                filter === 'completed' ? 'bg-emerald-600 text-white shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Done ({tasks.filter((t) => t.isCompleted).length})
            </button>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(239,68,68,0.3)] active:scale-95 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAdding ? 'Close' : 'New Task'}</span>
          </button>
        </div>
      </div>

      {/* New Task Inline Form */}
      {isAdding && (
        <form onSubmit={handleCreateTask} className="p-4 rounded-xl border border-red-900/60 bg-zinc-950/90 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <span className="font-heading font-bold text-xs uppercase tracking-wider text-red-400">
              CREATE OFFICIAL HOUSE CHALLENGE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Task Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Luxury Budget: Water Relay"
                className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as HouseTask['category'])}
                className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="Luxury Budget">Luxury Budget</option>
                <option value="Captaincy">Captaincy</option>
                <option value="Ration">Ration</option>
                <option value="Secret Mission">Secret Mission</option>
                <option value="Discipline">Discipline</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Reward Points</label>
              <input
                type="number"
                min="5"
                max="200"
                value={newPoints}
                onChange={(e) => setNewPoints(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white font-mono focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Assign To</label>
              <select
                value={newAssigneeType}
                onChange={(e) => setNewAssigneeType(e.target.value as 'contestant' | 'team')}
                className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="team">Whole Team</option>
                <option value="contestant">Single Contestant</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Select Target</label>
              {newAssigneeType === 'team' ? (
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value as TeamName)}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="Tigers">Team Tigers</option>
                  <option value="Wolves">Team Wolves</option>
                </select>
              ) : (
                <select
                  value={selectedContestantId}
                  onChange={(e) => setSelectedContestantId(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  {activeContestants.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.team})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow"
            >
              Broadcast Task
            </button>
          </div>
        </form>
      )}

      {/* Task List or Empty State */}
      {filteredTasks.length === 0 ? (
        <div className="py-8 px-4 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 text-center flex flex-col items-center justify-center">
          <div className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 mb-2">
            <CheckCheck className="w-5 h-5 text-zinc-500" />
          </div>
          <h4 className="text-sm font-bold text-zinc-300">No Tasks in Queue</h4>
          <p className="text-xs text-zinc-500 max-w-sm mt-1">
            All house challenges under this filter are cleared or have not yet been assigned by Big Boss.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`rounded-xl border p-3.5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                task.isCompleted
                  ? 'bg-zinc-950/50 border-zinc-800/60 opacity-70'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {/* Task Left */}
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getCategoryBadge(task.category)}`}>
                    {task.category}
                  </span>
                  <h4 className={`text-sm font-bold truncate ${task.isCompleted ? 'line-through text-zinc-400' : 'text-white'}`}>
                    {task.title}
                  </h4>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-1">{task.description}</p>
                <div className="flex items-center gap-2.5 text-[11px] font-mono text-zinc-500 pt-0.5">
                  <span className="flex items-center gap-1 text-zinc-400">
                    <Users className="w-3 h-3 text-zinc-500" />
                    Target: <strong className="text-zinc-200">{task.assignedName}</strong>
                  </span>
                  <span>•</span>
                  <span className="text-amber-400 font-bold">+{task.points} PTS</span>
                </div>
              </div>

              {/* Task Right Action */}
              <div className="shrink-0 flex items-center justify-end">
                {task.isCompleted ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-600/40 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Completed
                  </span>
                ) : (
                  <button
                    onClick={() => handleMarkComplete(task.id)}
                    title="Award task reward points and mark completed"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] active:scale-95 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Complete (+{task.points})</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
