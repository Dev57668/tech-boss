import React, { useState } from 'react';
import { CheckSquare, Plus, Award, CheckCircle2, User, Clock, AlertCircle, Trash2 } from 'lucide-react';
import type { Contestant, HouseTask } from '../types/bigboss';

export interface TaskManagementProps {
  tasks: HouseTask[];
  activeContestants: Contestant[];
  onCompleteTask: (taskId: string) => void;
  onCreateTask?: (title: string, assigneeId: string, reward?: number) => void;
  onDeleteTask?: (taskId: string) => void;
}

export const TaskManagement: React.FC<TaskManagementProps> = ({
  tasks,
  activeContestants,
  onCompleteTask,
  onCreateTask,
  onDeleteTask,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [reward, setReward] = useState('25');
  const [assigneeId, setAssigneeId] = useState<string>('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const targetAssigneeId = assigneeId || (activeContestants[0]?.id ?? '');
    if (!targetAssigneeId) return;

    const pts = parseInt(reward, 10) || 25;
    onCreateTask?.(title.trim(), targetAssigneeId, pts);

    setTitle('');
    setReward('25');
    setAssigneeId('');
    setIsCreating(false);
  };

  const pendingCount = tasks.filter((t) => t.status === 'Pending').length;

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
                {pendingCount} PENDING
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
                  value={reward}
                  onChange={(e) => setReward(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-full bg-[#ffffff] border border-[#dcdcd3] text-[#0d0e10] text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#0d0e10]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#75766f] uppercase mb-1">
                  Assignee *
                </label>
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-full bg-[#ffffff] border border-[#dcdcd3] text-[#0d0e10] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#0d0e10]"
                >
                  <option value="">-- Choose Assignee --</option>
                  {activeContestants.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.team})
                    </option>
                  ))}
                </select>
              </div>
            </div>
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
          {tasks.map((task) => {
            const isCompleted = task.status === 'Completed';
            const isCancelled = task.status === 'Cancelled';

            return (
              <div
                key={task.id}
                className={`rounded-2xl border p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCompleted
                    ? 'bg-[#fcfcf9] border-[#eeeee8] opacity-75'
                    : isCancelled
                    ? 'bg-[#f8f8f8] border-[#eeeee8] opacity-60'
                    : 'bg-[#ffffff] border-[#dcdcd3] hover:border-[#b0b0a4]'
                }`}
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-sm font-black ${isCompleted ? 'line-through text-[#75766f]' : 'text-[#0d0e10]'}`}>
                      {task.title}
                    </span>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#d4ff3a] text-[#0d0e10]">
                      +{task.reward} PTS
                    </span>

                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        COMPLETED
                      </span>
                    ) : isCancelled ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-200 text-zinc-700">
                        CANCELLED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f4f4ee] text-[#0d0e10]">
                        <Clock className="w-3 h-3" />
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#75766f] font-mono pt-0.5">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Assignee: <strong className="text-[#0d0e10] font-bold">{task.assigneeName}</strong>
                    </span>
                    {task.completedAt && (
                      <span>• Finished {task.completedAt}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 sm:self-center">
                  {onDeleteTask && (
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-2 rounded-full text-[#75766f] hover:text-rose-600 hover:bg-[#fff0f0] transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => onCompleteTask(task.id)}
                    disabled={isCompleted || isCancelled}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                      isCompleted || isCancelled
                        ? 'bg-[#f4f4ee] text-[#b0b0a4] cursor-not-allowed'
                        : 'framer-lime-btn shadow-sm'
                    }`}
                    title={isCompleted ? 'Points already awarded' : 'Complete and award points'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isCompleted ? 'Awarded' : 'Complete & Award'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
