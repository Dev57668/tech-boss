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
  avatarSeed?: string;
  bio?: string;
  evictedAt?: string;
}

export type ActivityType =
  | 'points_add'
  | 'points_deduct'
  | 'captain_change'
  | 'captain_cleared'
  | 'nomination_add'
  | 'nomination_remove'
  | 'immunity_grant'
  | 'immunity_revoke'
  | 'eviction'
  | 'reinstated'
  | 'task_assigned'
  | 'task_completed'
  | 'task_complete'
  | 'announcement'
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

export interface HouseStats {
  activeCount: number;
  highestScorer: { name: string; points: number } | null;
  totalPoints: number;
  nominatedCount: number;
  immuneCount: number;
  evictedCount: number;
}

export type TaskCategory = 'Luxury Budget' | 'Captaincy' | 'Ration' | 'Secret Mission' | 'Discipline' | 'General';

export interface HouseTask {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  points: number;
  pointsReward?: number;
  assignedType: 'contestant' | 'team' | 'all';
  assignedName: string;
  assignedContestantId?: string;
  assignedTeam?: TeamName;
  assignedToId?: string | null;
  assignedToName?: string | null;
  isCompleted: boolean;
  completedAt?: string;
}

export type AnnouncementSeverity = 'decree' | 'warning' | 'alert' | 'general' | 'normal' | 'urgent';

export interface HouseAnnouncement {
  id: string;
  timestamp: string;
  title?: string;
  message: string;
  severity: AnnouncementSeverity;
}

export type Announcement = HouseAnnouncement;

export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'eviction' | 'announcement';

export interface ToastMessage {
  id: string;
  variant: ToastVariant;
  title?: string;
  message: string;
  duration?: number;
}

export type ToastNotification = ToastMessage;
