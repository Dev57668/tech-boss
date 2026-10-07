export type ContestantStatus = 'Active' | 'Evicted';

export type TeamName = 'Tigers' | 'Wolves';

export interface Contestant {
  id: string;
  name: string;
  team: TeamName;
  points: number;
  status: ContestantStatus;
  isCaptain: boolean;
  isImmune: boolean;
  isNominated: boolean;
  avatarColor: string;
  bio?: string;
  evictedAt?: string;
}

export type TaskStatus = 'Pending' | 'Completed' | 'Cancelled';

export interface HouseTask {
  id: string;
  title: string;
  assigneeId: string;
  assigneeName: string;
  reward: number;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
}

export interface HouseAnnouncement {
  id: string;
  timestamp: string;
  message: string;
}

export type ActivityType =
  | 'points_add'
  | 'points_deduct'
  | 'captain_change'
  | 'nomination_add'
  | 'nomination_remove'
  | 'nomination_clear_all'
  | 'immunity_grant'
  | 'immunity_revoke'
  | 'eviction'
  | 'reinstated'
  | 'task_create'
  | 'task_complete'
  | 'task_cancel'
  | 'task_delete'
  | 'announcement'
  | 'timer_expire'
  | 'system';

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: ActivityType;
  contestantId?: string;
  contestantName: string;
  message: string;
  amount?: number;
  details?: string;
}

export interface TimerPersistedState {
  inputMinutes: number;
  inputSeconds: number;
  remainingSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
  endTimestamp: number | null;
  isTimesUp: boolean;
}

export interface HouseStats {
  activeCount: number;
  highestScorer: { name: string; points: number } | null;
  lowestScorer: { name: string; points: number } | null;
  totalPoints: number;
  nominatedCount: number;
  immuneCount: number;
  evictedCount: number;
  tasksCompleted: number;
  tasksPending: number;
  currentCaptain: { name: string; points: number } | null;
}

export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'eviction' | 'announcement';

export interface ToastMessage {
  id: string;
  variant: ToastVariant;
  title?: string;
  message: string;
  duration?: number;
}
