import { useState, useEffect, useCallback, useMemo } from 'react';
import type { 
  Contestant, 
  HouseTask, 
  HouseAnnouncement, 
  ActivityLog, 
  TimerPersistedState, 
  HouseStats, 
  ToastMessage,
  ActivityType
} from '../types/bigboss';
import { 
  INITIAL_CONTESTANTS, 
  INITIAL_TASKS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_ACTIVITIES 
} from '../data/initialContestants';
import { sound } from '../utils/sound';

const STORAGE_KEY_CONTESTANTS = 'bigboss_contestants_v3';
const STORAGE_KEY_TASKS = 'bigboss_tasks_v3';
const STORAGE_KEY_ANNOUNCEMENTS = 'bigboss_announcements_v3';
const STORAGE_KEY_ACTIVITIES = 'bigboss_activities_v3';
const STORAGE_KEY_TIMER = 'bigboss_timer_v3';

// Safe LocalStorage helpers with corrupted state fallbacks
function safeLoadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed === null || parsed === undefined) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function useHouseStore() {
  // 1. Contestants State
  const [contestants, setContestants] = useState<Contestant[]>(() => {
    const loaded = safeLoadJSON<Contestant[]>(STORAGE_KEY_CONTESTANTS, INITIAL_CONTESTANTS);
    if (Array.isArray(loaded) && loaded.length === 10 && loaded[0]?.id) {
      return loaded;
    }
    return INITIAL_CONTESTANTS;
  });

  // 2. Tasks State
  const [tasks, setTasks] = useState<HouseTask[]>(() => {
    const loaded = safeLoadJSON<HouseTask[]>(STORAGE_KEY_TASKS, INITIAL_TASKS);
    if (Array.isArray(loaded)) return loaded;
    return INITIAL_TASKS;
  });

  // 3. Announcements State
  const [announcements, setAnnouncements] = useState<HouseAnnouncement[]>(() => {
    const loaded = safeLoadJSON<HouseAnnouncement[]>(STORAGE_KEY_ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    if (Array.isArray(loaded)) return loaded;
    return INITIAL_ANNOUNCEMENTS;
  });

  // 4. Activities State (Strictly capped at 100)
  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const loaded = safeLoadJSON<ActivityLog[]>(STORAGE_KEY_ACTIVITIES, INITIAL_ACTIVITIES);
    if (Array.isArray(loaded)) return loaded.slice(0, 100);
    return INITIAL_ACTIVITIES;
  });

  // 5. Timer State with END TIMESTAMP persistence
  const [timer, setTimer] = useState<TimerPersistedState>(() => {
    const defaultTimer: TimerPersistedState = {
      inputMinutes: 5,
      inputSeconds: 0,
      totalSeconds: 300,
      remainingSeconds: 300,
      isRunning: false,
      endTimestamp: null,
      isTimesUp: false,
    };
    const loaded = safeLoadJSON<TimerPersistedState>(STORAGE_KEY_TIMER, defaultTimer);
    if (
      typeof loaded === 'object' &&
      typeof loaded.totalSeconds === 'number' &&
      typeof loaded.remainingSeconds === 'number'
    ) {
      // If was running before refresh, compute remaining time from endTimestamp!
      if (loaded.isRunning && loaded.endTimestamp) {
        const remaining = Math.max(0, Math.ceil((loaded.endTimestamp - Date.now()) / 1000));
        return {
          ...loaded,
          remainingSeconds: remaining,
          isRunning: remaining > 0,
          isTimesUp: remaining === 0,
        };
      }
      return {
        ...loaded,
        isRunning: false,
      };
    }
    return defaultTimer;
  });

  // 6. UI ephemeral states: Banner & Toasts
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONTESTANTS, JSON.stringify(contestants));
    } catch { /* ignore */ }
  }, [contestants]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch { /* ignore */ }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ANNOUNCEMENTS, JSON.stringify(announcements));
    } catch { /* ignore */ }
  }, [announcements]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(activities.slice(0, 100)));
    } catch { /* ignore */ }
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TIMER, JSON.stringify(timer));
    } catch { /* ignore */ }
  }, [timer]);

  // Helper: Format current timestamp
  const getNowTimestamp = useCallback((): string => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  // Helper: Toast Dispatcher
  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));

    const duration = toast.duration || 4500;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Helper: Activity Logger (strictly capped at 100 events)
  const logActivity = useCallback((
    type: ActivityType,
    contestantName: string,
    message: string,
    amount?: number,
    details?: string,
    contestantId?: string
  ) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: getNowTimestamp(),
      type,
      contestantId,
      contestantName,
      message,
      amount,
      details,
    };
    setActivities((prev) => [newLog, ...prev].slice(0, 100));
  }, [getNowTimestamp]);

  // === BUSINESS ACTIONS ===

  // 1. Point Adjustments (Negative totals allowed!)
  const addPoints = useCallback((contestantId: string, amount: number, reason?: string) => {
    const target = contestants.find((c) => c.id === contestantId);
    if (!target) return;

    if (target.status === 'Evicted') {
      addToast({
        variant: 'error',
        title: 'Action Blocked',
        message: `${target.name} has been evicted and cannot receive points.`,
      });
      return;
    }

    setContestants((prev) =>
      prev.map((c) => {
        if (c.id === contestantId) {
          // Negative totals allowed!
          return { ...c, points: c.points + amount };
        }
        return c;
      })
    );

    const isPositive = amount > 0;
    const sign = isPositive ? `+${amount}` : `${amount}`;
    const reasonText = reason ? ` (${reason})` : '';

    addToast({
      variant: isPositive ? 'success' : 'warning',
      title: isPositive ? 'Points Awarded' : 'Points Deducted',
      message: `${isPositive ? 'Awarded' : 'Deducted'} ${sign} PTS for ${target.name}${reasonText}.`,
    });

    logActivity(
      isPositive ? 'points_add' : 'points_deduct',
      target.name,
      `${isPositive ? 'Awarded' : 'Deducted'} ${sign} points for ${target.name}${reasonText}.`,
      amount,
      `New Total: ${target.points + amount} PTS`,
      contestantId
    );
  }, [contestants, addToast, logActivity]);

  // 2. Toggle Nomination (Immune blocked with error toast!)
  const toggleNomination = useCallback((contestantId: string) => {
    const target = contestants.find((c) => c.id === contestantId);
    if (!target) return;

    if (target.status === 'Evicted') {
      addToast({
        variant: 'error',
        title: 'Action Blocked',
        message: `${target.name} is evicted and cannot be nominated.`,
      });
      return;
    }

    // Immune contestant: nomination attempt shows error toast and changes nothing!
    if (target.isImmune && !target.isNominated) {
      sound.play('alert');
      addToast({
        variant: 'error',
        title: 'Immunity Shield Active',
        message: `${target.name} is IMMUNE and cannot be nominated for eviction!`,
      });
      return;
    }

    const willBeNominated = !target.isNominated;

    setContestants((prev) =>
      prev.map((c) => (c.id === contestantId ? { ...c, isNominated: willBeNominated } : c))
    );

    if (willBeNominated) {
      sound.play('alert');
      addToast({
        variant: 'warning',
        title: 'Nomination Alert',
        message: `${target.name} has been placed in the DANGER ZONE!`,
      });
      logActivity(
        'nomination_add',
        target.name,
        `${target.name} has been NOMINATED for eviction!`,
        undefined,
        'Placed in Danger Zone',
        contestantId
      );
    } else {
      sound.play('beep');
      addToast({
        variant: 'info',
        title: 'Nomination Cleared',
        message: `Nomination removed for ${target.name}. Safe from danger zone.`,
      });
      logActivity(
        'nomination_remove',
        target.name,
        `Nomination revoked for ${target.name}. Saved from Danger Zone.`,
        undefined,
        'Saved from Danger Zone',
        contestantId
      );
    }
  }, [contestants, addToast, logActivity]);

  // 3. Clear All Nominations
  const clearAllNominations = useCallback(() => {
    const nominatedCount = contestants.filter((c) => c.isNominated && c.status === 'Active').length;
    if (nominatedCount === 0) {
      addToast({
        variant: 'info',
        title: 'Danger Zone Clear',
        message: 'There are currently no active nominees to clear.',
      });
      return;
    }

    setContestants((prev) =>
      prev.map((c) => (c.isNominated ? { ...c, isNominated: false } : c))
    );

    sound.play('crown');
    addToast({
      variant: 'success',
      title: 'Nominations Cleared',
      message: `All ${nominatedCount} active nominations have been cleared! The house is safe.`,
    });

    logActivity(
      'nomination_clear_all',
      'Big Boss',
      `Big Boss Decree: Cleared all ${nominatedCount} active nominations. Danger zone reset.`,
      undefined,
      'Mass Pardon Decree'
    );
  }, [contestants, addToast, logActivity]);

  // 4. Toggle Immunity (Granting immunity clears nomination!)
  const toggleImmunity = useCallback((contestantId: string) => {
    const target = contestants.find((c) => c.id === contestantId);
    if (!target) return;

    if (target.status === 'Evicted') {
      addToast({
        variant: 'error',
        title: 'Action Blocked',
        message: `${target.name} is evicted and cannot receive immunity.`,
      });
      return;
    }

    const willBeImmune = !target.isImmune;

    setContestants((prev) =>
      prev.map((c) => {
        if (c.id === contestantId) {
          return {
            ...c,
            isImmune: willBeImmune,
            // Granting immunity to a nominated contestant clears the nomination!
            isNominated: willBeImmune ? false : c.isNominated,
          };
        }
        return c;
      })
    );

    if (willBeImmune) {
      sound.play('crown');
      addToast({
        variant: 'success',
        title: 'Immunity Shield Activated',
        message: `IMMUNITY granted to ${target.name}! Protected from weekly eviction.${target.isNominated ? ' (Nomination Cleared)' : ''}`,
      });
      logActivity(
        'immunity_grant',
        target.name,
        `IMMUNITY granted to ${target.name}. Protected from weekly eviction!`,
        undefined,
        'Shield Activated',
        contestantId
      );
    } else {
      sound.play('beep');
      addToast({
        variant: 'info',
        title: 'Immunity Revoked',
        message: `Immunity revoked for ${target.name}. Vulnerable to nominations.`,
      });
      logActivity(
        'immunity_revoke',
        target.name,
        `Immunity revoked for ${target.name}. Shield Deactivated.`,
        undefined,
        'Shield Deactivated',
        contestantId
      );
    }
  }, [contestants, addToast, logActivity]);

  // 5. Captaincy (Only ONE Captain at a time, gold badge)
  const setCaptain = useCallback((newCaptainId: string) => {
    const target = contestants.find((c) => c.id === newCaptainId);
    if (!target || target.status === 'Evicted') return;

    setContestants((prev) =>
      prev.map((c) => {
        if (c.id === newCaptainId) {
          return {
            ...c,
            isCaptain: true,
            isImmune: true,
            isNominated: false,
          };
        }
        return {
          ...c,
          isCaptain: false,
        };
      })
    );

    sound.play('crown');
    addToast({
      variant: 'success',
      title: 'New House Captain',
      message: `${target.name} crowned House Captain! Full immunity & privileges granted.`,
    });

    logActivity(
      'captain_change',
      target.name,
      `NEW CAPTAIN: ${target.name} crowned House Captain!`,
      undefined,
      'Full Immunity & Captain privileges granted',
      newCaptainId
    );
  }, [contestants, addToast, logActivity]);

  // 6. Eviction (Clears captaincy, flags, cancels assignee's pending tasks, moves to Evicted panel)
  const evictContestant = useCallback((contestantId: string) => {
    const target = contestants.find((c) => c.id === contestantId);
    if (!target || target.status === 'Evicted') return;

    const wasCaptain = target.isCaptain;

    // Update contestant
    setContestants((prev) =>
      prev.map((c) => {
        if (c.id === contestantId) {
          return {
            ...c,
            status: 'Evicted',
            isCaptain: false,
            isNominated: false,
            isImmune: false,
            evictedAt: getNowTimestamp(),
          };
        }
        return c;
      })
    );

    // Cancel pending tasks assigned to this contestant
    setTasks((prev) =>
      prev.map((t) => {
        if (t.assigneeId === contestantId && t.status === 'Pending') {
          return { ...t, status: 'Cancelled' };
        }
        return t;
      })
    );

    sound.play('alert');

    // Dramatic eviction toast
    addToast({
      variant: 'eviction',
      title: 'HOUSE EVICTION NOTICE',
      message: `${target.name} has been evicted from the house.`,
      duration: 6500,
    });

    logActivity(
      'eviction',
      target.name,
      `EVICTION: ${target.name} has been EVICTED from the Big Boss House!`,
      undefined,
      `Final Score: ${target.points} PTS • Eliminated`,
      contestantId
    );

    if (wasCaptain) {
      addToast({
        variant: 'warning',
        title: 'Captaincy Vacated',
        message: `House Captain ${target.name} was evicted! The position is now VACANT.`,
      });
      logActivity(
        'captain_change',
        target.name,
        `Captaincy Vacant: Captain ${target.name} was evicted from the house.`,
        undefined,
        'Position Vacant',
        contestantId
      );
    }
  }, [contestants, getNowTimestamp, addToast, logActivity]);

  // 7. Task Management: Create Task
  const createTask = useCallback((title: string, assigneeId: string, reward: number = 25) => {
    if (!title.trim()) {
      addToast({ variant: 'error', title: 'Invalid Task', message: 'Task title is required.' });
      return;
    }

    const assignee = contestants.find((c) => c.id === assigneeId && c.status === 'Active');
    if (!assignee) {
      addToast({ variant: 'error', title: 'Invalid Assignee', message: 'Assignee must be an active contestant.' });
      return;
    }

    const positiveReward = Math.max(1, Math.round(Number(reward) || 25));

    const newTask: HouseTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      assigneeId: assignee.id,
      assigneeName: assignee.name,
      reward: positiveReward,
      status: 'Pending',
      createdAt: getNowTimestamp(),
    };

    setTasks((prev) => [newTask, ...prev]);

    addToast({
      variant: 'success',
      title: 'Task Created',
      message: `Task "${newTask.title}" assigned to ${assignee.name} (+${positiveReward} PTS).`,
    });

    logActivity(
      'task_create',
      assignee.name,
      `Task Created: "${newTask.title}" assigned to ${assignee.name} (Reward: ${positiveReward} PTS).`,
      positiveReward,
      'Status: Pending',
      assignee.id
    );
  }, [contestants, getNowTimestamp, addToast, logActivity]);

  // 8. Task Management: Mark Complete (Guarded against double clicks)
  const completeTask = useCallback((taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status !== 'Pending') {
      return; // Never award twice!
    }

    const assignee = contestants.find((c) => c.id === task.assigneeId);
    if (!assignee) return;

    // 1. Mark task as completed
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'Completed', completedAt: getNowTimestamp() } : t))
    );

    // 2. Award points to assignee
    setContestants((prev) =>
      prev.map((c) => (c.id === task.assigneeId ? { ...c, points: c.points + task.reward } : c))
    );

    sound.play('crown');

    addToast({
      variant: 'success',
      title: 'Task Completed',
      message: `Task "${task.title}" completed! +${task.reward} PTS awarded to ${task.assigneeName}.`,
    });

    logActivity(
      'task_complete',
      task.assigneeName,
      `Task Completed: ${task.assigneeName} finished "${task.title}" (+${task.reward} PTS awarded).`,
      task.reward,
      'Status: Completed',
      task.assigneeId
    );
  }, [tasks, contestants, getNowTimestamp, addToast, logActivity]);

  // 9. Task Management: Delete Task (Completed task keeps awarded points)
  const deleteTask = useCallback((taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    addToast({
      variant: 'info',
      title: 'Task Removed',
      message: `Task "${task.title}" removed from house board.`,
    });

    logActivity(
      'task_delete',
      task.assigneeName,
      `Task Removed: "${task.title}" was deleted from house registry.`,
      undefined,
      `Prior status: ${task.status}`
    );
  }, [tasks, addToast, logActivity]);

  // 10. Big Boss Announcements (Max 200 chars, top banner 5s)
  const broadcastAnnouncement = useCallback((message: string) => {
    const trimmed = message.trim();
    if (!trimmed) {
      addToast({ variant: 'error', title: 'Empty Message', message: 'Announcement cannot be empty.' });
      return;
    }
    if (trimmed.length > 200) {
      addToast({ variant: 'error', title: 'Exceeds Limit', message: 'Announcement must be 200 characters or less.' });
      return;
    }

    const newAnn: HouseAnnouncement = {
      id: `ann-${Date.now()}`,
      timestamp: getNowTimestamp(),
      message: trimmed,
    };

    setAnnouncements((prev) => [newAnn, ...prev]);

    // Full-width dramatic banner at top for 5 seconds
    setBannerMessage(trimmed);
    sound.play('alert');

    // Auto dismiss banner after 5s
    setTimeout(() => {
      setBannerMessage((current) => (current === trimmed ? null : current));
    }, 5000);

    logActivity(
      'announcement',
      'Big Boss',
      `Big Boss Decree: "${trimmed}"`,
      undefined,
      'PA Broadcast'
    );
  }, [getNowTimestamp, addToast, logActivity]);

  const dismissBanner = useCallback(() => {
    setBannerMessage(null);
  }, []);

  // 11. Task Timer Actions (End Timestamp Persistence)
  const setTimerDuration = useCallback((minutes: number, seconds: number) => {
    const total = Math.max(0, minutes * 60 + seconds);
    setTimer({
      inputMinutes: Math.max(0, minutes),
      inputSeconds: Math.max(0, Math.min(59, seconds)),
      totalSeconds: total,
      remainingSeconds: total,
      isRunning: false,
      endTimestamp: null,
      isTimesUp: false,
    });
  }, []);

  const startTimer = useCallback(() => {
    if (timer.remainingSeconds <= 0 && timer.totalSeconds <= 0) {
      addToast({ variant: 'error', title: 'Invalid Timer', message: 'Please set a duration greater than 0.' });
      return;
    }

    sound.play('click');
    const startFrom = timer.remainingSeconds > 0 ? timer.remainingSeconds : timer.totalSeconds;
    const endTimestamp = Date.now() + startFrom * 1000;

    setTimer((prev) => ({
      ...prev,
      remainingSeconds: startFrom,
      isRunning: true,
      endTimestamp,
      isTimesUp: false,
    }));
  }, [timer.remainingSeconds, timer.totalSeconds, addToast]);

  const pauseTimer = useCallback(() => {
    sound.play('click');
    setTimer((prev) => ({
      ...prev,
      isRunning: false,
      endTimestamp: null,
    }));
  }, []);

  const resetTimer = useCallback(() => {
    sound.play('click');
    setTimer((prev) => ({
      ...prev,
      remainingSeconds: prev.totalSeconds,
      isRunning: false,
      endTimestamp: null,
      isTimesUp: false,
    }));
  }, []);

  // Timer Tick Effect (Interval cleanup on unmount)
  useEffect(() => {
    if (!timer.isRunning) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (!prev.isRunning || !prev.endTimestamp) return prev;
        const remaining = Math.max(0, Math.ceil((prev.endTimestamp - Date.now()) / 1000));

        if (remaining <= 0) {
          sound.play('alert');
          addToast({
            variant: 'warning',
            title: "TIME'S UP!",
            message: 'House challenge countdown has concluded.',
          });
          logActivity(
            'timer_expire',
            'Big Boss',
            "Task Timer Expired: Time's up for the current house challenge.",
            undefined,
            '00:00 Final Buzzer'
          );
          return {
            ...prev,
            remainingSeconds: 0,
            isRunning: false,
            endTimestamp: null,
            isTimesUp: true,
          };
        }

        return {
          ...prev,
          remainingSeconds: remaining,
        };
      });
    }, 500);

    return () => clearInterval(interval);
  }, [timer.isRunning, addToast, logActivity]);

  // 12. Reset House (Brings back all contestants to seed data, resets tasks & timer)
  const resetHouse = useCallback(() => {
    sound.play('alert');
    setContestants(INITIAL_CONTESTANTS);
    setTasks(INITIAL_TASKS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setActivities(INITIAL_ACTIVITIES);
    setTimer({
      inputMinutes: 5,
      inputSeconds: 0,
      totalSeconds: 300,
      remainingSeconds: 300,
      isRunning: false,
      endTimestamp: null,
      isTimesUp: false,
    });
    setBannerMessage(null);

    try {
      localStorage.removeItem(STORAGE_KEY_CONTESTANTS);
      localStorage.removeItem(STORAGE_KEY_TASKS);
      localStorage.removeItem(STORAGE_KEY_ANNOUNCEMENTS);
      localStorage.removeItem(STORAGE_KEY_ACTIVITIES);
      localStorage.removeItem(STORAGE_KEY_TIMER);
    } catch { /* ignore */ }

    addToast({
      variant: 'success',
      title: 'House Reset Complete',
      message: 'All 10 housemates restored to active rosters with kickoff seed data!',
    });
  }, [addToast]);

  const toggleSound = useCallback(() => {
    const isNowOn = sound.toggle();
    setSoundEnabled(isNowOn);
  }, []);

  // === SELECTORS ===
  const activeContestants = useMemo(
    () => contestants.filter((c) => c.status === 'Active'),
    [contestants]
  );

  const evictedContestants = useMemo(
    () => contestants.filter((c) => c.status === 'Evicted'),
    [contestants]
  );

  const currentCaptain = useMemo(
    () => activeContestants.find((c) => c.isCaptain) || null,
    [activeContestants]
  );

  const currentNominees = useMemo(
    () => activeContestants.filter((c) => c.isNominated),
    [activeContestants]
  );

  const immuneContestants = useMemo(
    () => activeContestants.filter((c) => c.isImmune),
    [activeContestants]
  );

  const highestScorer = useMemo(() => {
    if (activeContestants.length === 0) return null;
    return activeContestants.reduce((prev, curr) => (curr.points > prev.points ? curr : prev), activeContestants[0]);
  }, [activeContestants]);

  const lowestScorer = useMemo(() => {
    if (activeContestants.length === 0) return null;
    return activeContestants.reduce((prev, curr) => (curr.points < prev.points ? curr : prev), activeContestants[0]);
  }, [activeContestants]);

  const tasksCompleted = useMemo(
    () => tasks.filter((t) => t.status === 'Completed').length,
    [tasks]
  );

  const tasksPending = useMemo(
    () => tasks.filter((t) => t.status === 'Pending').length,
    [tasks]
  );

  const totalPoints = useMemo(
    () => contestants.reduce((acc, curr) => acc + curr.points, 0),
    [contestants]
  );

  const houseStats: HouseStats = useMemo(() => ({
    activeCount: activeContestants.length,
    highestScorer: highestScorer ? { name: highestScorer.name, points: highestScorer.points } : null,
    lowestScorer: lowestScorer ? { name: lowestScorer.name, points: lowestScorer.points } : null,
    totalPoints,
    nominatedCount: currentNominees.length,
    immuneCount: immuneContestants.length,
    evictedCount: evictedContestants.length,
    tasksCompleted,
    tasksPending,
    currentCaptain: currentCaptain ? { name: currentCaptain.name, points: currentCaptain.points } : null,
  }), [
    activeContestants.length,
    highestScorer,
    lowestScorer,
    totalPoints,
    currentNominees.length,
    immuneContestants.length,
    evictedContestants.length,
    tasksCompleted,
    tasksPending,
    currentCaptain,
  ]);

  // Live Leaderboard with Ties: standard competition ranking
  const rankedContestants = useMemo(() => {
    const sorted = [...activeContestants].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return a.name.localeCompare(b.name);
    });

    return sorted.map((c) => ({
      ...c,
      displayRank: sorted.findIndex((s) => s.points === c.points) + 1,
    }));
  }, [activeContestants]);

  return {
    // State
    contestants,
    tasks,
    announcements,
    activities,
    timer,
    bannerMessage,
    toasts,
    soundEnabled,

    // Selectors
    activeContestants,
    evictedContestants,
    currentCaptain,
    currentNominees,
    immuneContestants,
    highestScorer,
    lowestScorer,
    tasksCompleted,
    tasksPending,
    totalPoints,
    houseStats,
    rankedContestants,

    // Actions
    addPoints,
    toggleNomination,
    clearAllNominations,
    toggleImmunity,
    setCaptain,
    evictContestant,
    createTask,
    completeTask,
    deleteTask,
    broadcastAnnouncement,
    dismissBanner,
    setTimerDuration,
    startTimer,
    pauseTimer,
    resetTimer,
    resetHouse,
    toggleSound,
    dismissToast,
  };
}
