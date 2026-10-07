import React, { useState } from 'react';
import { CheckSquare, Plus, Award, CheckCircle2, User, Clock, AlertCircle } from 'lucide-react';
import type { Contestant, HouseTask, TaskCategory } from '../types/bigboss';

interface TaskManagementProps {
  tasks: HouseTask[];
  activeContestants: Contestant[];
  onCompleteTask: (taskId: string) => void;
  onAddTask?: (task: Omit<HouseTask, 'id' | 'isCompleted'>) => void;
  onCreateTask?: (title: string, description: string, pointsReward: number, assignedToId: string | null) => void;
}

export const TaskManagement: React.FC<TaskManagementProps> = ({
  tasks,
  activeContestants,
  onCompleteTask,
  onAddTask,
  onCreateTask,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pointsReward, setPointsReward] = useState('30');
  const [assignedToId, setAssignedToId] = useState<string>('');
  const [category, setCategory] = useState<TaskCategory>('Luxury Budget');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const pts = parseInt(pointsReward, 10) || 25;

    if (onAddTask) {
      const selectedContestant = activeContestants.find((c) => c.id === assignedToId);
      onAddTask({
        title: title.trim(),
        description: description.trim(),
        category,
        points: pts,
        assignedType: selectedContestant ? 'contestant' : 'all',
        assignedName: selectedContestant ? selectedContestant.name : 'All Housemates',
        assignedContestantId: selectedContestant ? selectedContestant.id : undefined,
      });
    } else if (onCreateTask) {
      onCreateTask(title.trim(), description.trim(), pts, assignedToId || null);
    }

    setTitle('');
    setDescription('');
    setPointsReward('30');
    setAssignedToId('');
    setIsCreating(false);
  };

  return (
    <div id="section-tasks" className="rounded-3xl border border-[#dcdcd3] bg-[#ffffff] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#eeeee8]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#0d0e10] text-[#d4ff3a] flex items-center justify-center">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-black text-base tracking-tight text-[#0d0e10] uppercase flex items-center gap-2">
              HOUSE TASK MANAGEMENT
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#f4f4ee] text-[#0d0e10] font-bold">
                {tasks.filter((t) => !t.isCompleted).length} PENDING
              </span>
            </h3>
            <p className="text-xs text-[#75766f]">Assign official house challenges & award scores</p>
          </div>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0d0e10] hover:bg-[#202227] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isCreating ? 'Cancel' : 'Create Task'}</span>
        </button>
      </div>

      {/* Task Creation Form */}
      {isCreating && (
        <form onSubmit={handleFormSubmit} className="p-4 sm:p-5 rounded-2xl bg-[#f8f8f4] border border-[#dcdcd3] space-y-3 animate-in fade-in duration-150">
          <div className="text-xs font-bold uppercase text-[#0d0e10] tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#a1c914]" />
            Issue New House Challenge
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#75766f] uppercase mb-1">
                Task Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Captaincy Obstacle Challenge"
                required
                className="w-full px-3.5 py-2 rounded-full bg-[#ffffff] border border-[#dcdcd3] text-[#0d0e10] text-xs focus:outline-none focus:ring-1 focus:ring-[#0d0e10]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-[#75766f] uppercase mb-1">
                  Points Reward
                </label>
                <input
                  type="number"
                  min="5"
                  max="200"
                  value={pointsReward}
                  onChange={(e) => setPointsReward(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-full bg-[#ffffff] border border-[#dcdcd3] text-[#0d0e10] text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#0d0e10]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#75766f] uppercase mb-1">
                  Assignee
                </label>
                <select
                  value={assignedToId}
                  onChange={(e) => setAssignedToId(e.target.value)}
                  className="w-full px-3 py-2 rounded-full bg-[#ffffff] border border-[#dcdcd3] text-[#0d0e10] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#0d0e10]"
                >
                  <option value="">-- Open House --</option>
                  {activeContestants.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.team})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#75766f] uppercase mb-1">
              Instructions / Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed rules of the challenge..."
              className="w-full px-3.5 py-2 rounded-full bg-[#ffffff] border border-[#dcdcd3] text-[#0d0e10] text-xs focus:outline-none focus:ring-1 focus:ring-[#0d0e10]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-full bg-[#ffffff] border border-[#dcdcd3] text-[#75766f] text-xs font-bold hover:text-[#0d0e10]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="framer-lime-btn px-5 py-2 text-xs font-black uppercase tracking-wider"
            >
              Publish Challenge
            </button>
          </div>
        </form>
      )}

      {/* Task List or Empty State */}
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center rounded-2xl bg-[#f4f4ee] border border-dashed border-[#dcdcd3]">
          <AlertCircle className="w-8 h-8 text-[#75766f] mb-2" />
          <p className="text-xs font-bold text-[#0d0e10] uppercase tracking-wider">
            No Tasks Active
          </p>
          <p className="text-xs text-[#75766f] mt-0.5">
            Click &quot;Create Task&quot; above to issue a new challenge.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`rounded-2xl border p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                task.isCompleted
                  ? 'bg-[#fcfcf9] border-[#eeeee8] opacity-75'
                  : 'bg-[#ffffff] border-[#dcdcd3] hover:border-[#b0b0a4]'
              }`}
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-sm font-black ${task.isCompleted ? 'line-through text-[#75766f]' : 'text-[#0d0e10]'}`}>
                    {task.title}
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#d4ff3a] text-[#0d0e10]">
                    +{task.points || task.pointsReward || 30} PTS
                  </span>

                  {task.isCompleted ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      COMPLETED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f4f4ee] text-[#0d0e10]">
                      <Clock className="w-3 h-3" />
                      ACTIVE
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#75766f] leading-snug">
                  {task.description}
                </p>

                <div className="flex items-center gap-3 text-xs text-[#75766f] font-mono pt-0.5">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Assignee: <strong className="text-[#0d0e10] font-bold">{task.assignedName || task.assignedToName || 'House Open'}</strong>
                  </span>
                  {task.completedAt && (
                    <span>• Finished {task.completedAt}</span>
                  )}
                </div>
              </div>

              {/* Complete Action Button */}
              <div className="shrink-0 sm:self-center">
                <button
                  onClick={() => onCompleteTask(task.id)}
                  disabled={task.isCompleted}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    task.isCompleted
                      ? 'bg-[#f4f4ee] text-[#b0b0a4] cursor-not-allowed'
                      : 'framer-lime-btn shadow-sm'
                  }`}
                  title={task.isCompleted ? 'Points already awarded' : 'Complete and award points'}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{task.isCompleted ? 'Awarded' : 'Complete & Award'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
