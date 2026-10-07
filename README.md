# BIG BOSS — HOUSE COMMAND CENTER

> **Enterprise-grade, real-time command dashboard for Big Boss house operations, surveillance, and automated scoring.**

---

## 📌 Overview

**BIG BOSS: HOUSE COMMAND CENTER** is a mission-critical web application built for the executive producers and controllers of the Big Boss reality house. Engineered with high-performance React 19, TypeScript, Vite, Tailwind CSS v4, and Lucide React, it manages contestant telemetry, nominations, immunity shields, luxury tasks, broadcast announcements, countdown challenges, and permanent evictions with immediate real-time state synchronization and persistent `localStorage` storage.

---

## 🚀 Tech Stack

- **Framework**: React 19 (`react`, `react-dom`)
- **Language**: TypeScript (`tsc -b`)
- **Bundler & Dev Server**: Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Icons**: Lucide React
- **Linter**: Oxlint (0 errors, 0 warnings)
- **Audio Engine**: Web Audio API (Synthesized command room SFX, zero external audio asset dependencies)
- **Persistence**: Browser `localStorage` with corrupted-state fallback mechanisms

---

## 🎯 12 Mandatory Features Implemented

| # | Feature Name | Description & Implementation Details |
|---|---|---|
| **1** | **Contestant Management** | Complete dossiers for 10 realistic housemates (`Aarav`, `Ananya`, `Kabir`, `Meera`, `Rohan`, `Siya`, `Arjun`, `Kiara`, `Vivaan`, `Tara`). View switcher for **Card Grid** and **Control Room Table View**. Search and multi-criteria filters (Active, Nominated, Immune, Evicted, Team Tigers, Team Wolves). |
| **2** | **Live Leaderboard** | Real-time standings sorted descending by points. **Top 3 highlighted** (Gold Crown for Rank 1, Silver for Rank 2, Bronze for Rank 3). Excludes evicted contestants and recalculates ranks instantly with stable tie resolution. |
| **3** | **Task Management** | Issue and assign house challenges across categories (*Luxury Budget, Captaincy, Ration, Secret Mission, Discipline*). Completing tasks awards points **once**, updates completion timestamps, and permanently disables double-awarding. |
| **4** | **Point System** | Rapid adjustment buttons (`+10`, `+25`, `+50`, `-10`, `-25`, `-50`) plus a Custom Point Modal. Validates and strictly rejects empty, zero, decimal, and non-numeric inputs. Supports negative total scores. |
| **5** | **Captaincy Command** | Prominent luxury Gold Captain Card. Strictly enforces **one Captain at a time**. Awards immunity shield to the Captain. Evicting the Captain automatically vacates the position and logs the vacancy. |
| **6** | **Nominations System** | Toggle house nominations on any active contestant with real-time danger badges. Automatically synchronizes with the Danger Zone and Leaderboard status badges. |
| **7** | **Immunity Shielding** | Immune contestants **cannot** be nominated (triggers error toast and blocks action without modifying state). Granting immunity to an already-nominated contestant **immediately clears their nomination**. |
| **8** | **Danger Zone** | Dedicated live monitoring module tracking all nominated contestants in danger of eviction. Includes fast un-nominate and direct eviction triggers, with an inactive empty state. |
| **9** | **Big Boss Announcements** | Real-time broadcast system. Broadcasts decrees via top marquee banner with urgency levels (*Urgent Warning, General Order, Critical Penalty*) and logs entries in the live feed. |
| **10** | **Task Countdown Timer** | High-precision digital timer with Start, Pause, and Reset controls. Presets for 1m, 2m, and 5m. Includes visual and audio warning beeps during the **final 10 seconds**. |
| **11** | **House Statistics (KPIs)** | 6 live telemetry KPI cards: Active Contestants, Highest Scorer, Total House Points, Current Nominees, Immune Contestants, and Evicted Contestants. 100% computed from state. |
| **12** | **Eviction Engine** | Dedicated Evict button with confirmation modal: *"Evict <Name>? This cannot be undone."* Instantly clears flags, removes from leaderboard and captaincy eligibility, updates KPIs, displays a dramatic eviction toast, locks all actions, and lists them in a dedicated **Evicted Panel**. |

---

## 🛠️ Running Locally

### Prerequisites
- Node.js `v18+` or `v20+` or `v24+`
- npm `v9+` or `v10+` or `v11+`

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:5174/](http://localhost:5174/) (or the port specified in terminal) in your browser.

### 3. Build for Production
```bash
npm run build
```
Generates a zero-error production bundle in the `dist/` directory.

### 4. Run Linter
```bash
npm run lint
```

---

## ⏱️ 2-Minute "How to Demo" Walkthrough

1. **Observe Initial House Telemetry**:
   - Check the **KPI Cards** at the top: Active Contestants, Highest Scorer, Total Points, Current Nominees, and Immune Contestants.
   - Note the **Reigning Captain Card** highlighting **Aarav** in gold.
2. **Test Point System**:
   - On **Ananya's** card, click `+50`.
   - Watch the **Live Leaderboard** instantly reorder in real time, moving Ananya up the ranks.
   - Click `Custom...` on Kabir, select *Task Victory*, input `40`, and confirm to see custom points applied.
3. **Test Captaincy Shift**:
   - In the **House Captain Card**, open the *Change Captain* dropdown.
   - Select **Ananya**. Observe the gold crown badge transfer, Aarav's captaincy removed, and the header updated.
4. **Test Immunity vs. Nomination Constraint**:
   - Locate **Rohan** (who holds an Immunity Shield).
   - Click `Nominate` on Rohan. Notice the **error toast**: *"Nomination Blocked: Rohan holds Immunity and CANNOT be nominated!"*
   - Locate a nominated contestant (e.g., **Kiara**) and click `Grant Immunity`. Notice her nomination is automatically cleared!
5. **Test Task System & Timer**:
   - Click `Complete & Award` on the *Endurance Ring* task. Notice points are awarded once, the task turns green, and the button disables.
   - In the **Task Timer**, click `1M` and `START`. Listen to the audio cues and watch the pulse warning trigger at 10 seconds.
6. **Test Eviction Decree (Feature #12)**:
   - Click `Evict` on any active contestant (e.g., **Kiara**).
   - The confirmation modal appears: *"Evict Kiara? This cannot be undone."*
   - Click *Evict Contestant*.
   - Watch the dramatic red eviction toast, observe Kiara disappear from the Leaderboard, see the **Danger Zone** count decrement, and find Kiara listed in the separate **Evicted Panel** with disabled controls.
7. **Test LocalStorage Persistence**:
   - Refresh your browser (`F5` or `Ctrl+R`). All points, evicted states, and activity logs remain intact!
   - Click **Reset House** in the header to return the house to kickoff state.

---

## ☁️ Deployment (Vercel Ready)

This application is ready for zero-configuration Vercel deployment:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node.js Version**: 18.x or 20.x
- **Environment Variables**: None required

---

## 🐙 Git Commands to Initialize, Commit, and Push

To publish this project to a new GitHub repository:

```bash
# 1. Initialize git repository
git init

# 2. Add all files to staging
git add .

# 3. Commit the changes
git commit -m "feat: complete Big Boss House Command Center with all 12 mandatory features"

# 4. Rename default branch to main
git branch -M main

# 5. Add remote GitHub repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/big-boss-command-center.git

# 6. Push to GitHub
git push -u origin main
```
