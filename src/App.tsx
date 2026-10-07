import { useState } from 'react';
import type { Contestant } from './types/bigboss';
import { useHouseStore } from './store/houseStore';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HouseStatistics } from './components/HouseStatistics';
import { CaptainCard } from './components/CaptainCard';
import { TaskTimer } from './components/TaskTimer';
import { DangerZone } from './components/DangerZone';
import { BigBossAnnouncements } from './components/BigBossAnnouncements';
import { BigBossBanner } from './components/BigBossBanner';
import { ContestantManagement } from './components/ContestantManagement';
import { EvictedPanel } from './components/EvictedPanel';
import { TaskManagement } from './components/TaskManagement';
import { LiveLeaderboard } from './components/LiveLeaderboard';
import { ActivityFeed } from './components/ActivityFeed';
import { Footer } from './components/Footer';
import { CustomPointModal } from './components/CustomPointModal';
import { EvictionConfirmModal } from './components/EvictionConfirmModal';
import { ToastContainer } from './components/ToastContainer';

export default function App() {
  const store = useHouseStore();

  // Ephemeral modal selection states
  const [customPointContestant, setCustomPointContestant] = useState<Contestant | null>(null);
  const [evictionCandidate, setEvictionCandidate] = useState<Contestant | null>(null);

  const handleConfirmEviction = (contestantId: string) => {
    store.evictContestant(contestantId);
    setEvictionCandidate(null);
  };

  const handleResetWithConfirm = () => {
    if (
      window.confirm(
        'Reset the Big Boss House to initial season kickoff state?\n\nThis will restore all 10 contestants to active status, reset challenges, timer, and announcements.'
      )
    ) {
      store.resetHouse();
    }
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#eeeee8] text-[#0d0e10] flex flex-col font-sans selection:bg-[#d4ff3a] selection:text-[#0d0e10]">
      {/* Part 2 Mandatory: Full-width Big Boss Voice Dramatic Banner at top of screen for 5s */}
      <BigBossBanner
        message={store.bannerMessage}
        onDismiss={store.dismissBanner}
      />

      {/* Global Toast Stack */}
      <ToastContainer
        toasts={store.toasts}
        onDismiss={store.dismissToast}
      />

      {/* Floating Framer Pill Navbar */}
      <Header
        currentCaptain={store.currentCaptain || undefined}
        activeCount={store.activeContestants.length}
        totalCount={store.contestants.length}
        soundEnabled={store.soundEnabled}
        onToggleSound={store.toggleSound}
        onResetData={handleResetWithConfirm}
        onNavigate={scrollToSection}
      />

      {/* Main Command Dashboard */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-4 sm:py-6 space-y-10">
        
        {/* Hero Section with Framer Editorial Aesthetic */}
        <Hero
          stats={store.houseStats}
          captain={store.currentCaptain || undefined}
          onJumpToHousemates={() => scrollToSection('section-housemates')}
          onJumpToDangerZone={() => scrollToSection('section-danger')}
        />

        {/* Section 1: House Overview & Telemetry KPIs */}
        <section id="section-overview" aria-label="House KPI Statistics" className="scroll-mt-24">
          <div className="mb-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#75766f]">
              SYSTEM TELEMETRY
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0d0e10] tracking-tight">
              House Performance Metrics
            </h2>
          </div>
          <HouseStatistics
            stats={store.houseStats}
            totalContestants={store.contestants.length}
          />
        </section>

        {/* Section 2: Executive Captaincy & Real-Time Task Mission Timer */}
        <section aria-label="Captaincy and Task Mission Timer" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-8 flex flex-col justify-between">
            <CaptainCard
              captain={store.currentCaptain || undefined}
              activeContestants={store.activeContestants}
              onSetCaptain={store.setCaptain}
            />
          </div>
          <div className="lg:col-span-4 flex flex-col justify-between">
            <TaskTimer
              timer={store.timer}
              onSetDuration={store.setTimerDuration}
              onStart={store.startTimer}
              onPause={store.pauseTimer}
              onReset={store.resetTimer}
            />
          </div>
        </section>

        {/* Section 3: Danger Zone & Supreme Big Boss Broadcast Console */}
        <section id="section-danger" aria-label="Danger Zone and Announcements" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch scroll-mt-24">
          <div className="lg:col-span-7 flex flex-col justify-between">
            <DangerZone
              nominees={store.currentNominees}
              onRemoveNomination={store.toggleNomination}
              onRequestEvict={(c) => setEvictionCandidate(c)}
              onClearAllNominations={store.clearAllNominations}
            />
          </div>
          <div className="lg:col-span-5 flex flex-col justify-between">
            <BigBossAnnouncements
              announcements={store.announcements}
              onBroadcast={store.broadcastAnnouncement}
            />
          </div>
        </section>

        {/* Section 4: Main 2-Column Operational Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Column (8 cols): Contestant Dossiers, Evicted Roster, Task Management */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Contestant Management */}
            <section id="section-housemates" aria-label="Contestant Management" className="space-y-4 scroll-mt-24">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#dcdcd3] pb-3">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#75766f]">
                    ROSTER SURVEILLANCE
                  </span>
                  <h3 className="text-2xl font-black text-[#0d0e10] uppercase tracking-tight flex items-center gap-2">
                    Housemate Dossiers & Controls
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#f4f4ee] border border-[#dcdcd3] text-[#0d0e10] font-bold">
                      {store.activeContestants.length} ACTIVE
                    </span>
                  </h3>
                </div>
                <p className="text-xs text-[#75766f] max-w-sm">
                  Point decrees, captaincy promotions, immunity shields, and eviction orders.
                </p>
              </div>

              <ContestantManagement
                contestants={store.contestants}
                onAddPoints={store.addPoints}
                onToggleNomination={store.toggleNomination}
                onToggleImmunity={store.toggleImmunity}
                onRequestEviction={(c) => setEvictionCandidate(c)}
                onSetCaptain={store.setCaptain}
                onOpenCustomPoints={(c) => setCustomPointContestant(c)}
              />
            </section>

            {/* Dedicated EVICTED Section (Feature #12) */}
            <section aria-label="Evicted Housemates Roster">
              <EvictedPanel evictedContestants={store.evictedContestants} />
            </section>

            {/* Task Management (Part 2 Mandatory) */}
            <section id="section-tasks" aria-label="House Task Management" className="scroll-mt-24">
              <TaskManagement
                tasks={store.tasks}
                activeContestants={store.activeContestants}
                onCompleteTask={store.completeTask}
                onCreateTask={store.createTask}
                onDeleteTask={store.deleteTask}
              />
            </section>

          </div>

          {/* Right Column (4 cols): Live Leaderboard & Live Activity Stream */}
          <aside className="lg:col-span-4 space-y-8" aria-label="Leaderboard and Activity Stream">
            
            {/* Live Leaderboard (Active only, ties supported, dynamic ranks) */}
            <div id="section-leaderboard" className="h-[520px] scroll-mt-24">
              <LiveLeaderboard
                contestants={store.contestants}
                onSelectContestant={(c) => setCustomPointContestant(c)}
              />
            </div>

            {/* Live Activity Feed (Capped at 100 events, filtered) */}
            <div className="h-[520px]">
              <ActivityFeed
                activities={store.activities}
                onClearLogs={() => {
                  // Handled gracefully in feed
                }}
              />
            </div>

          </aside>

        </div>

      </main>

      {/* Editorial Framer Dark Footer */}
      <Footer />

      {/* Custom Points Modal */}
      <CustomPointModal
        contestant={customPointContestant}
        isOpen={Boolean(customPointContestant)}
        onClose={() => setCustomPointContestant(null)}
        onApplyPoints={(contestantId, delta, reason) => {
          store.addPoints(contestantId, delta, reason);
        }}
      />

      {/* Eviction Confirmation Modal */}
      <EvictionConfirmModal
        contestant={evictionCandidate}
        isOpen={Boolean(evictionCandidate)}
        onClose={() => setEvictionCandidate(null)}
        onConfirmEviction={handleConfirmEviction}
      />
    </div>
  );
}
