import { useState, useEffect, useMemo } from 'react';
import type { 
  Contestant, 
  ActivityLog, 
  HouseStats, 
  HouseTask, 
  HouseAnnouncement, 
  ToastMessage, 
  AnnouncementSeverity 
} from './types/bigboss';
import { 
  INITIAL_CONTESTANTS, 
  INITIAL_ACTIVITIES, 
  INITIAL_TASKS, 
  INITIAL_ANNOUNCEMENTS 
} from './data/initialContestants';
import { Header } from './components/Header';
import { HouseStatistics } from './components/HouseStatistics';
import { CaptainCard } from './components/CaptainCard';
import { TaskTimer } from './components/TaskTimer';
import { DangerZone } from './components/DangerZone';
import { BigBossAnnouncements } from './components/BigBossAnnouncements';
import { ContestantManagement } from './components/ContestantManagement';
import { EvictedPanel } from './components/EvictedPanel';
import { TaskManagement } from './components/TaskManagement';
import { LiveLeaderboard } from './components/LiveLeaderboard';
import { ActivityFeed } from './components/ActivityFeed';
import { CustomPointModal } from './components/CustomPointModal';
import { EvictionConfirmModal } from './components/EvictionConfirmModal';
import { ToastContainer } from './components/ToastContainer';
import { sound } from './utils/sound';

const STORAGE_KEY_CONTESTANTS = 'bigboss_contestants_v2';
const STORAGE_KEY_ACTIVITIES = 'bigboss_activities_v2';
const STORAGE_KEY_TASKS = 'bigboss_tasks_v2';
const STORAGE_KEY_ANNOUNCEMENTS = 'bigboss_announcements_v2';

export default function App() {
  // 1. Contestants state with corrupted & empty localStorage resilience
  const [contestants, setContestants] = useState<Contestant[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONTESTANTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id && parsed[0].name) {
          return parsed;
        }
      }
    } catch {
      // Fallback on corrupted localStorage
    }
    return INITIAL_CONTESTANTS;
  });

  // 2. Activities state (capped at 100 events)
  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.slice(0, 100);
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_ACTIVITIES;
  });

  // 3. Tasks state
  const [tasks, setTasks] = useState<HouseTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_TASKS;
  });

  // 4. Announcements state
  const [announcements, setAnnouncements] = useState<HouseAnnouncement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ANNOUNCEMENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  // 5. Toast system state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // 6. Modal states
  const [customPointModalContestant, setCustomPointModalContestant] = useState<Contestant | null>(null);
  const [evictionCandidate, setEvictionCandidate] = useState<Contestant | null>(null);

  // 7. Sound toggle
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Sync state to localStorage safely
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONTESTANTS, JSON.stringify(contestants));
    } catch {
      // Ignore quota errors
    }
  }, [contestants]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(activities.slice(0, 100)));
    } catch {
      // Ignore quota errors
    }
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch {
      // Ignore quota errors
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ANNOUNCEMENTS, JSON.stringify(announcements));
    } catch {
      // Ignore quota errors
    }
  }, [announcements]);

  // Toast Helper
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));

    // Auto dismiss
    const duration = toast.duration || 4500;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper to format current time
  const getNowTimestamp = (): string => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Helper to add activity (capped strictly at latest 100 events)
  const addActivity = (
    type: ActivityLog['type'],
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
    // REQUIREMENT: Activity feed capped at the latest 100 events
    setActivities((prev) => [newLog, ...prev].slice(0, 100));
  };

  // Derived Values & Statistics
  const activeContestants = useMemo(
    () => contestants.filter((c) => c.status === 'Active'),
    [contestants]
  );

  const evictedContestants = useMemo(
    () => contestants.filter((c) => c.status === 'Evicted'),
    [contestants]
  );

  const currentCaptain = useMemo(
    () => activeContestants.find((c) => c.isCaptain),
    [activeContestants]
  );

  const currentNominees = useMemo(
    () => activeContestants.filter((c) => c.isNominated),
    [activeContestants]
  );

  const houseStats: HouseStats = useMemo(() => {
    const active = contestants.filter((c) => c.status === 'Active');
    const totalPoints = contestants.reduce((acc, curr) => acc + curr.points, 0);
    const highestScorer =
      active.length > 0
        ? active.reduce((prev, curr) => (curr.points > prev.points ? curr : prev), active[0])
        : null;

    return {
      activeCount: active.length,
      highestScorer: highestScorer ? { name: highestScorer.name, points: highestScorer.points } : null,
      totalPoints,
      nominatedCount: active.filter((c) => c.isNominated).length,
      immuneCount: active.filter((c) => c.isImmune).length,
      evictedCount: contestants.filter((c) => c.status === 'Evicted').length,
    };
  }, [contestants]);

  // ACTION: Add / Deduct Points
  const handleAddPoints = (contestantId: string, amount: number, customReason?: string) => {
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
          const newPoints = Math.max(0, c.points + amount);
          return { ...c, points: newPoints };
        }
        return c;
      })
    );

    const isPositive = amount > 0;
    const sign = isPositive ? `+${amount}` : `${amount}`;
    const reasonText = customReason ? ` (${customReason})` : '';

    addToast({
      variant: isPositive ? 'success' : 'warning',
      title: isPositive ? 'Points Awarded' : 'Points Deducted',
      message: `${isPositive ? 'Awarded' : 'Deducted'} ${sign} PTS for ${target.name}${reasonText}.`,
    });

    addActivity(
      isPositive ? 'points_add' : 'points_deduct',
      target.name,
      `${isPositive ? 'Awarded' : 'Deducted'} ${sign} points for ${target.name}${reasonText}.`,
      amount,
      `New Total: ${Math.max(0, target.points + amount)} PTS`,
      contestantId
    );
  };

  // ACTION: Toggle Nomination
  // EDGE CASE: "Immune contestant: nomination attempt shows an error toast and changes nothing."
  const handleToggleNomination = (contestantId: string) => {
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

    // REQUIREMENT: Immune contestant: nomination attempt shows an error toast and changes nothing!
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
      prev.map((c) => {
        if (c.id === contestantId) {
          return {
            ...c,
            isNominated: willBeNominated,
          };
        }
        return c;
      })
    );

    if (willBeNominated) {
      sound.play('alert');
      addToast({
        variant: 'warning',
        title: 'Nomination Alert',
        message: `${target.name} has been placed in the DANGER ZONE for eviction!`,
      });
      addActivity(
        'nomination_add',
        target.name,
        `${target.name} has been NOMINATED for eviction!`,
        undefined,
        'Direct House Decree',
        contestantId
      );
    } else {
      sound.play('beep');
      addToast({
        variant: 'info',
        title: 'Nomination Revoked',
        message: `Nomination cleared for ${target.name}. Safe for now.`,
      });
      addActivity(
        'nomination_remove',
        target.name,
        `Nomination revoked for ${target.name}. Saved from Danger Zone.`,
        undefined,
        'Danger Zone Cleared',
        contestantId
      );
    }
  };

  // ACTION: Toggle Immunity
  // EDGE CASE: "Granting immunity to a nominated contestant clears the nomination."
  const handleToggleImmunity = (contestantId: string) => {
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
            // REQUIREMENT: Granting immunity to a nominated contestant clears the nomination
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
      addActivity(
        'immunity_grant',
        target.name,
        `IMMUNITY granted to ${target.name}. Protected from weekly eviction!`,
        undefined,
        'Immunity Shield Activated',
        contestantId
      );
    } else {
      sound.play('beep');
      addToast({
        variant: 'info',
        title: 'Immunity Revoked',
        message: `Immunity revoked for ${target.name}. Vulnerable to nominations.`,
      });
      addActivity(
        'immunity_revoke',
        target.name,
        `Immunity revoked for ${target.name}. Shield Deactivated.`,
        undefined,
        'Vulnerable to Nominations',
        contestantId
      );
    }
  };

  // ACTION: Set / Change Captain (Only ONE Captain can exist)
  const handleSetCaptain = (newCaptainId: string) => {
    const target = contestants.find((c) => c.id === newCaptainId);
    if (!target || target.status === 'Evicted') return;

    setContestants((prev) =>
      prev.map((c) => {
        if (c.id === newCaptainId) {
          return {
            ...c,
            isCaptain: true,
            isImmune: true, // Captain always has immunity
            isNominated: false,
          };
        }
        // Remove captain status from all other contestants
        return {
          ...c,
          isCaptain: false,
        };
      })
    );

    addToast({
      variant: 'success',
      title: 'New House Captain',
      message: `${target.name} has been crowned the new House Captain!`,
    });

    addActivity(
      'captain_change',
      target.name,
      `NEW CAPTAIN: ${target.name} crowned House Captain!`,
      undefined,
      'Full Immunity & Captain privileges granted',
      newCaptainId
    );
  };

  // ACTION: Execute Eviction (Mandatory Feature #12)
  // EDGE CASE: "Evicting the Captain, an immune contestant, or the highest scorer."
  const handleExecuteEviction = (contestantId: string) => {
    const target = contestants.find((c) => c.id === contestantId);
    if (!target) return;

    const wasCaptain = target.isCaptain;

    setContestants((prev) =>
      prev.map((c) => {
        if (c.id === contestantId) {
          return {
            ...c,
            status: 'Evicted',
            isCaptain: false,
            isNominated: false, // REQUIREMENT: Clear nomination flag
            isImmune: false,    // REQUIREMENT: Clear immunity flag
            evictedAt: getNowTimestamp(),
          };
        }
        return c;
      })
    );

    sound.play('alert');

    // REQUIREMENT: Show dramatic toast: "<Name> has been evicted from the house."
    addToast({
      variant: 'eviction',
      title: 'HOUSE EVICTION NOTICE',
      message: `${target.name} has been evicted from the house.`,
      duration: 6000,
    });

    // REQUIREMENT: Log the eviction in the activity feed
    addActivity(
      'eviction',
      target.name,
      `EVICTION: ${target.name} has been EVICTED from the Big Boss House!`,
      undefined,
      `Final Score: ${target.points} PTS • Main Gates Closed`,
      contestantId
    );

    // REQUIREMENT: If they were Captain, clear Captain and log it
    if (wasCaptain) {
      addToast({
        variant: 'warning',
        title: 'Captaincy Vacated',
        message: `House Captain ${target.name} was evicted! The position is now VACANT.`,
      });
      addActivity(
        'captain_change',
        target.name,
        `Captaincy Vacant: Captain ${target.name} was evicted from the house.`,
        undefined,
        'Interim Command Mode Active',
        contestantId
      );
    }
  };

  // ACTION: Task Completion
  // EDGE CASE: "Double-clicking Mark Complete never awards points twice."
  const handleCompleteTask = (taskId: string) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask || targetTask.isCompleted) return;

    // Mark task completed
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isCompleted: true, completedAt: getNowTimestamp() } : t))
    );

    // Award reward points
    if (targetTask.assignedType === 'contestant' && targetTask.assignedContestantId) {
      const cId = targetTask.assignedContestantId;
      setContestants((prev) =>
        prev.map((c) => (c.id === cId ? { ...c, points: c.points + targetTask.points } : c))
      );
    } else if (targetTask.assignedType === 'team' && targetTask.assignedTeam) {
      const teamName = targetTask.assignedTeam;
      setContestants((prev) =>
        prev.map((c) =>
          c.team === teamName && c.status === 'Active'
            ? { ...c, points: c.points + targetTask.points }
            : c
        )
      );
    }

    addToast({
      variant: 'success',
      title: 'Task Victory',
      message: `Task "${targetTask.title}" completed! +${targetTask.points} PTS awarded to ${targetTask.assignedName}.`,
    });

    addActivity(
      'task_complete',
      targetTask.assignedName,
      `Task Victory: ${targetTask.title} (+${targetTask.points} PTS awarded).`,
      targetTask.points,
      `Category: ${targetTask.category}`
    );
  };

  // ACTION: Add Custom Task
  const handleAddTask = (newTaskData: Omit<HouseTask, 'id' | 'isCompleted'>) => {
    const newTask: HouseTask = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      isCompleted: false,
    };
    setTasks((prev) => [newTask, ...prev]);

    addToast({
      variant: 'info',
      title: 'New Task Broadcast',
      message: `Challenge "${newTask.title}" is now active in the house.`,
    });
  };

  // ACTION: Big Boss Decree Broadcast
  const handleBroadcastAnnouncement = (
    title: string,
    message: string,
    severity: AnnouncementSeverity
  ) => {
    const newAnn: HouseAnnouncement = {
      id: `ann-${Date.now()}`,
      timestamp: getNowTimestamp(),
      title,
      message,
      severity,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);

    addToast({
      variant: 'announcement',
      title: `BIG BOSS DECREE: ${title}`,
      message,
      duration: 5000,
    });

    addActivity(
      'announcement',
      'Big Boss',
      `Decree Broadcasted: "${title}" - ${message}`,
      undefined,
      `Severity: ${severity.toUpperCase()}`
    );
  };

  // ACTION: Reset House
  // REQUIREMENT: "Reset House" button that restores seed data and brings everyone back!
  const handleResetData = () => {
    if (
      window.confirm(
        'Reset the Big Boss House data to initial season kickoff state?\n\nThis will restore all 10 contestants to active status and reset seed tasks.'
      )
    ) {
      sound.play('alert');
      setContestants(INITIAL_CONTESTANTS);
      setActivities(INITIAL_ACTIVITIES);
      setTasks(INITIAL_TASKS);
      setAnnouncements(INITIAL_ANNOUNCEMENTS);

      try {
        localStorage.removeItem(STORAGE_KEY_CONTESTANTS);
        localStorage.removeItem(STORAGE_KEY_ACTIVITIES);
        localStorage.removeItem(STORAGE_KEY_TASKS);
        localStorage.removeItem(STORAGE_KEY_ANNOUNCEMENTS);
      } catch {
        // Ignore
      }

      addToast({
        variant: 'success',
        title: 'House Reset Complete',
        message: 'All 10 housemates returned to active rosters with kickoff seed data!',
      });
    }
  };

  // ACTION: Toggle Sound
  const handleToggleSound = () => {
    const isNowOn = sound.toggle();
    setSoundEnabled(isNowOn);
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Radar grid subtle background */}
      <div className="fixed inset-0 radar-grid opacity-30 pointer-events-none z-0"></div>

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Global Header */}
      <Header
        currentCaptain={currentCaptain}
        activeCount={houseStats.activeCount}
        totalCount={contestants.length}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onResetData={handleResetData}
      />

      {/* Main Command Dashboard */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        
        {/* KPI House Statistics Cards */}
        <section aria-label="House KPI Statistics">
          <HouseStatistics stats={houseStats} totalContestants={contestants.length} />
        </section>

        {/* Row 2: Captain Showcase & Mission Timer */}
        <section aria-label="Captaincy and Task Mission Timer" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-8 flex flex-col justify-between">
            <CaptainCard
              captain={currentCaptain}
              activeContestants={activeContestants}
              onSetCaptain={handleSetCaptain}
            />
          </div>
          <div className="lg:col-span-4 flex flex-col justify-between">
            <TaskTimer
              onTimerExpired={() => {
                addToast({
                  variant: 'warning',
                  title: 'Task Buzzer Ringing',
                  message: 'Mission countdown has expired! All house action must cease.',
                });
              }}
            />
          </div>
        </section>

        {/* Row 3: Danger Zone & Big Boss PA Announcements */}
        <section aria-label="Danger Zone and Announcements" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between">
            <DangerZone
              nominees={currentNominees}
              onSaveWithImmunity={handleToggleImmunity}
              onRequestEvict={(c) => setEvictionCandidate(c)}
            />
          </div>
          <div className="lg:col-span-5 flex flex-col justify-between">
            <BigBossAnnouncements
              announcements={announcements}
              onBroadcastAnnouncement={handleBroadcastAnnouncement}
              onClearAnnouncements={() => setAnnouncements([])}
            />
          </div>
        </section>

        {/* 2-Column Responsive Operational Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Column (8 cols): Contestants, Evicted Panel, Task Management */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Contestant Management */}
            <section aria-label="Contestant Management" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-heading font-black text-white uppercase tracking-wider flex items-center gap-2">
                    CONTESTANT DOSSIERS & CONTROLS
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-normal">
                      {contestants.length} HOUSEMATES
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Real-time point allocation, weekly nomination flags, immunity shields, and eviction orders.
                  </p>
                </div>
              </div>

              <ContestantManagement
                contestants={contestants}
                onAddPoints={handleAddPoints}
                onToggleNomination={handleToggleNomination}
                onToggleImmunity={handleToggleImmunity}
                onRequestEviction={(c) => setEvictionCandidate(c)}
                onSetCaptain={handleSetCaptain}
                onOpenCustomPoints={(c) => setCustomPointModalContestant(c)}
              />
            </section>

            {/* MANDATORY FEATURE #12: Dedicated EVICTED Section */}
            <EvictedPanel evictedContestants={evictedContestants} />

            {/* Task Management */}
            <section aria-label="House Task Management">
              <TaskManagement
                tasks={tasks}
                activeContestants={activeContestants}
                onCompleteTask={handleCompleteTask}
                onAddTask={handleAddTask}
              />
            </section>

          </div>

          {/* Right Column (4 cols): Live Leaderboard & Live Activity Feed */}
          <aside className="lg:col-span-4 space-y-6" aria-label="Leaderboard and Activity Stream">
            
            {/* Live Leaderboard (Active only, ties supported, dynamic ranks) */}
            <div className="h-[480px]">
              <LiveLeaderboard
                contestants={contestants}
                onSelectContestant={(c) => setCustomPointModalContestant(c)}
              />
            </div>

            {/* Live Activity Feed (Capped at 100 events, filtered) */}
            <div className="h-[480px]">
              <ActivityFeed
                activities={activities}
                onClearLogs={() => setActivities([])}
              />
            </div>

          </aside>

        </div>

      </main>

      {/* Footer Info */}
      <footer className="relative z-10 border-t border-zinc-900 bg-[#060608] py-4 px-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="font-mono text-zinc-400">BIG BOSS COMMAND CENTER • v2.0 PRODUCTION</span>
          </div>
          <p className="text-zinc-500">
            Automated House State Engine • LocalStorage Persistent • Zero-Latency Reorder
          </p>
        </div>
      </footer>

      {/* Custom Points Modal */}
      <CustomPointModal
        contestant={customPointModalContestant}
        isOpen={Boolean(customPointModalContestant)}
        onClose={() => setCustomPointModalContestant(null)}
        onApplyPoints={(contestantId, delta, reason) => {
          handleAddPoints(contestantId, delta, reason);
        }}
        onErrorToast={(msg) => {
          addToast({
            variant: 'error',
            title: 'Invalid Input',
            message: msg,
          });
        }}
      />

      {/* Eviction Confirmation Modal */}
      <EvictionConfirmModal
        contestant={evictionCandidate}
        isOpen={Boolean(evictionCandidate)}
        onClose={() => setEvictionCandidate(null)}
        onConfirmEviction={(contestantId) => {
          handleExecuteEviction(contestantId);
        }}
      />
    </div>
  );
}
