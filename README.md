# Big Boss — House Command Center

An executive, real-time surveillance and mission control dashboard for the Big Boss House. Built with high-performance React 19, TypeScript, and Vite, featuring a responsive sci-fi dark command center aesthetic with real-time telemetric updates, sound synthesis, and state persistence.

---

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + Custom Glassmorphism Design System
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio Engine**: Native Web Audio API synthesizer oscillators (`SoundEffects`)
- **State Architecture**: Centralized Store (`src/store/houseStore.ts`) enforcing business rules, actions, and selectors
- **Persistence**: Safe `localStorage` with corrupted-state recovery, end-timestamp timer accuracy, and zero-latency state synchronization

---

## 🌟 Feature Checklist (12 Mandatory Features)

| # | Feature | Description & Implementation | Status |
|:---:|:---|:---|:---:|
| **1** | **Contestant Management** | 10 realistic housemates (`Aarav`, `Ananya`, `Kabir`, `Meera`, `Rohan`, `Siya`, `Arjun`, `Kiara`, `Vivaan`, `Tara`) with table/card layouts, search, team filters, and full dossier status badges. | **PASS** |
| **2** | **Live Leaderboard** | Real-time auto-sorting by score. Only active housemates compete. Standard competition tie-ranking (ties receive identical rank number with stable ordering). Top 3 spotlight badges. | **PASS** |
| **3** | **Task Management** | Create task with active-only assignee and positive reward. Filter tabs (All/Pending/Completed). "Mark Complete" awards points once (double-click lockout). Delete task. Assignee eviction automatically cancels pending tasks (dimmed). | **PASS** |
| **4** | **Point System** | Instant adjustment buttons (+10, +25, +50, -10, -25, -50) and validated Custom Points modal (bounds 1–1,000 PTS, decimal rounding, empty/negative guards; negative totals allowed). | **PASS** |
| **5** | **Captaincy** | Prominent House Captain showcase. Only one captain at a time. Captain holds permanent immunity and gold badge across the app. Dynamic captain replacement selector. | **PASS** |
| **6** | **Nominations** | One-click nomination flagging with danger warnings, dynamic nominee counts, and Danger Zone synchronization. | **PASS** |
| **7** | **Immunity Shield** | Immune contestants are shielded from eviction. Attempting to nominate an immune contestant displays an error toast and changes nothing. Granting immunity clears existing nomination. | **PASS** |
| **8** | **Danger Zone** | Dedicated red-alert zone displaying all nominated contestants with initials/avatar, team, points, and counter badge. Quick actions: "Remove Nomination", "Evict", and "Clear All Nominations" with confirmation. Empty state when safe. | **PASS** |
| **9** | **Big Boss Announcements** | Text input with 200-char limit and live character counter. 3 quick-select presets. Live feed. Full-width dramatic top-screen banner ("BIG BOSS SPEAKS") for 5 seconds on broadcast. | **PASS** |
| **10** | **Task Mission Timer** | Duration inputs (minutes/seconds), Start, Pause, Reset. Monospace countdown with shrinking progress bar. Last 10s red pulse. At 00:00: auto-stop, "TIME'S UP" state, audio buzzer, and activity log. End-timestamp persistence survives refresh. | **PASS** |
| **11** | **House Statistics (KPIs)** | 10 live telemetry metrics derived via selectors: Active Contestants, Highest Scorer, Lowest Scorer, Total Points, Current Nominees, Immune Contestants, Evicted Contestants, Tasks Completed, Tasks Pending, Current Captain. | **PASS** |
| **12** | **Eviction Requirements** | Irrevocable eviction flow with confirmation modal ("Evict <Name>? This cannot be undone."). Instantly removes from leaderboard, clears captaincy, disables all actions, increments Evicted KPI, cancels pending tasks, and displays in separate EVICTED panel. | **PASS** |

---

## 🛡️ Edge Cases Handled & Tested

1. **Evicting Captain, Immune, Nominee, or Highest Scorer**:
   - Evicting the Captain automatically vacates the Captaincy, sets status to "VACANT", removes them from dropdowns, and logs the vacancy.
   - Evicting an immune contestant or nominee safely clears their immunity and nomination flags.
   - Evicting the highest scorer automatically recalculates the leaderboard and promotes the next active highest scorer.
   - Any pending tasks assigned to the evicted contestant are immediately set to "Cancelled" and shown dimmed.
2. **Immunity Nomination Protection**:
   - Attempting to nominate an immune contestant triggers an error toast (`"<Name> is IMMUNE and cannot be nominated!"`), plays an alert sound, and does not alter the contestant's state.
3. **Nomination Clearing via Immunity**:
   - Granting immunity to an already-nominated contestant instantly clears their nomination flag (`isNominated: false`).
4. **Custom Point Input Hardening**:
   - Validates for empty input, non-numeric strings, decimals (rounded to integer), zero, and values exceeding 1,000 PTS. Negative totals are supported.
5. **Double-Click Lockout on Task Completion**:
   - "Mark Complete" employs an immediate lockout ref and status check to ensure reward points are never awarded twice.
6. **Corrupted & Mid-Timer Storage Resilience**:
   - `TaskTimer` calculates `endTimestamp - Date.now()` upon refresh to resume countdown accurately.
   - Corrupted or invalid `localStorage` JSON values are safely caught and fall back to seed data without crashing.
7. **Leaderboard Ties**:
   - Contestants tied on points share the same rank number (e.g. two leaders share #1), with stable secondary sorting by name.
8. **Activity Log Memory Cap**:
   - The activity feed is strictly capped at the latest 100 events (`.slice(0, 100)`).

---

## 💻 How to Run Locally

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or pnpm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```
The production bundle will be generated in `dist/`.

### 4. Preview the Production Build
```bash
npm run preview
```

---

## 🎯 2-Minute "How to Demo" Walkthrough

1. **House Overview & Statistics**:
   - Inspect the **House Statistics** grid: all 10 KPIs are live (Active Contestants, Highest Scorer, Lowest Scorer, Total Points, Current Nominees, Immune, Evicted, Tasks Completed, Tasks Pending, Current Captain).
2. **Point System & Leaderboard Reorder**:
   - Click `+50` on Kabir's card. Notice his points jump to 170 and the Live Leaderboard immediately reorders.
   - Click `Custom...` on Ananya's card, enter `60` with reason "Secret Task", and click `Confirm Decree`. Observe her rising to #1 with 205 PTS.
3. **Danger Zone & Immunity Guard**:
   - Attempt to nominate Rohan (who holds an IMMUNE badge): an error toast blocks the action: *"Rohan is IMMUNE and cannot be nominated for eviction!"*.
   - Nominate Ananya: she enters the **DANGER ZONE** immediately with a counter badge of 1.
   - In Danger Zone, click `Remove Nomination`: she is safely removed, or click `Save (Shield)` to grant immunity.
   - Test `Clear All Nominations` with confirmation: all active nominations are cleared.
4. **Task Management & Eviction Cancellation**:
   - In **Task Management**, click `Create Task`, choose title "Night Watch", select active assignee "Vivaan", and reward 30 PTS.
   - Double-click `Mark Complete (+30)` on a pending task: points are awarded exactly once and status moves to `Completed`.
   - Evict a contestant with a pending task: notice their pending task immediately turns `Cancelled` and appears dimmed.
5. **Big Boss Announcements & Top Banner**:
   - Click one of the 3 presets or type a decree under 200 characters with the live counter.
   - Click `Broadcast`: a full-width dramatic red/gold banner titled **BIG BOSS SPEAKS** appears across the top of the screen for 5 seconds (dismissible).
6. **Task Mission Timer with End-Timestamp Persistence**:
   - Set 2 minutes and click `START TIMER`.
   - Refresh the page: the timer seamlessly continues ticking down accurately from the stored end timestamp.
   - Let it reach the last 10 seconds: the timer turns red and pulses. At `00:00`, it triggers "TIME'S UP" and an alert sound.
7. **Eviction Flow & Reset House**:
   - Click `Evict` on any active contestant: the confirmation modal appears. Confirm eviction:
     - Contestant is removed from Live Leaderboard.
     - Appears in the dedicated greyed-out **EVICTED CONTESTANTS** section with a red badge.
     - Actions are disabled.
   - Click `RESET HOUSE` in the header: confirm prompt, and all 10 contestants return to active status with kickoff seed data.

---

## 🚀 Deployment to Vercel

The project is fully pre-configured for Vercel deployment:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: None required
