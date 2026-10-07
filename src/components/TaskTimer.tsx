import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, BellRing } from 'lucide-react';
import { sound } from '../utils/sound';

const STORAGE_KEY_TIMER = 'bigboss_timer_state_v1';

interface TimerData {
  duration: number;
  remaining: number;
  isRunning: boolean;
  lastSavedTimestamp?: number;
}

interface TaskTimerProps {
  onTimerExpired?: () => void;
}

export const TaskTimer: React.FC<TaskTimerProps> = ({ onTimerExpired }) => {
  // Safe initial load from localStorage
  const [timerState, setTimerState] = useState<TimerData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TIMER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          typeof parsed === 'object' &&
          parsed !== null &&
          typeof parsed.duration === 'number' &&
          !isNaN(parsed.duration) &&
          typeof parsed.remaining === 'number' &&
          !isNaN(parsed.remaining) &&
          typeof parsed.isRunning === 'boolean'
        ) {
          if (parsed.isRunning && parsed.lastSavedTimestamp) {
            const elapsed = Math.floor((Date.now() - parsed.lastSavedTimestamp) / 1000);
            const remaining = Math.max(0, parsed.remaining - elapsed);
            return {
              duration: parsed.duration,
              remaining,
              isRunning: remaining > 0,
              lastSavedTimestamp: Date.now(),
            };
          }
          return {
            duration: parsed.duration,
            remaining: parsed.remaining,
            isRunning: false,
          };
        }
      }
    } catch {
      // Fallback for corrupted localStorage
    }
    return {
      duration: 300,
      remaining: 300,
      isRunning: false,
    };
  });

  const onTimerExpiredRef = useRef(onTimerExpired);
  useEffect(() => {
    onTimerExpiredRef.current = onTimerExpired;
  }, [onTimerExpired]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_TIMER,
        JSON.stringify({
          ...timerState,
          lastSavedTimestamp: Date.now(),
        })
      );
    } catch {
      // Ignore localStorage write error
    }
  }, [timerState]);

  // Ticking effect
  useEffect(() => {
    if (!timerState.isRunning) return;

    const interval = setInterval(() => {
      setTimerState((prev) => {
        if (!prev.isRunning) return prev;
        if (prev.remaining <= 1) {
          sound.play('alert');
          onTimerExpiredRef.current?.();
          return {
            ...prev,
            remaining: 0,
            isRunning: false,
            lastSavedTimestamp: Date.now(),
          };
        }
        return {
          ...prev,
          remaining: prev.remaining - 1,
          lastSavedTimestamp: Date.now(),
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerState.isRunning]);

  const handleStart = () => {
    sound.play('click');
    if (timerState.remaining <= 0) {
      setTimerState((prev) => ({
        ...prev,
        remaining: prev.duration,
        isRunning: true,
        lastSavedTimestamp: Date.now(),
      }));
    } else {
      setTimerState((prev) => ({
        ...prev,
        isRunning: true,
        lastSavedTimestamp: Date.now(),
      }));
    }
  };

  const handlePause = () => {
    sound.play('click');
    setTimerState((prev) => ({
      ...prev,
      isRunning: false,
    }));
  };

  const handleReset = (newDuration?: number) => {
    sound.play('click');
    setTimerState((prev) => {
      const dur = newDuration !== undefined ? newDuration : prev.duration;
      return {
        duration: dur,
        remaining: dur,
        isRunning: false,
      };
    });
  };

  const minutes = Math.floor(timerState.remaining / 60);
  const seconds = timerState.remaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPct =
    timerState.duration > 0
      ? Math.max(0, Math.min(100, Math.round((timerState.remaining / timerState.duration) * 100)))
      : 0;

  return (
    <div className="rounded-2xl border border-zinc-800/90 bg-gradient-to-br from-zinc-900/90 via-[#0e0e13] to-zinc-950 p-4 sm:p-5 backdrop-blur-xl shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-950/60 border border-red-800/40 text-red-400">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-heading font-black text-sm uppercase tracking-wider text-white flex items-center gap-2">
              TASK MISSION TIMER
              {timerState.isRunning && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              )}
            </h4>
            <p className="text-[11px] text-zinc-400">Time-bounded house challenges countdown</p>
          </div>
        </div>

        {timerState.remaining === 0 && (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-700/50 animate-bounce">
            <BellRing className="w-3 h-3" />
            TIME EXPIRED
          </span>
        )}
      </div>

      {/* Main Clock Face & Progress */}
      <div className="my-2 flex flex-col items-center justify-center">
        <div className="relative py-2">
          <span
            className={`font-mono text-4xl sm:text-5xl font-black tracking-widest ${
              timerState.remaining <= 10 && timerState.remaining > 0
                ? 'text-red-500 animate-pulse'
                : timerState.remaining === 0
                ? 'text-rose-600'
                : timerState.isRunning
                ? 'text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                : 'text-zinc-200'
            }`}
          >
            {formattedTime}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-800/80 rounded-full h-2 overflow-hidden mt-1">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              timerState.remaining <= 30 ? 'bg-red-500' : 'bg-gradient-to-r from-amber-500 to-red-500'
            }`}
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>
      </div>

      {/* Preset Quick Selectors */}
      <div className="grid grid-cols-4 gap-1.5 my-3">
        {[
          { label: '2M', sec: 120 },
          { label: '5M', sec: 300 },
          { label: '10M', sec: 600 },
          { label: '15M', sec: 900 },
        ].map((p) => (
          <button
            key={p.label}
            onClick={() => handleReset(p.sec)}
            className={`py-1 text-[11px] font-mono font-bold rounded-lg border transition-all ${
              timerState.duration === p.sec && !timerState.isRunning
                ? 'bg-amber-950/60 border-amber-500/60 text-amber-300'
                : 'bg-zinc-800/70 border-zinc-700/60 text-zinc-400 hover:text-white hover:bg-zinc-800'
            } focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 pt-1">
        {timerState.isRunning ? (
          <button
            onClick={handlePause}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-bold transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>PAUSE TIMER</span>
          </button>
        ) : (
          <button
            onClick={handleStart}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] active:scale-95 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{timerState.remaining < timerState.duration && timerState.remaining > 0 ? 'RESUME' : 'START TIMER'}</span>
          </button>
        )}

        <button
          onClick={() => handleReset()}
          title="Reset timer to original duration"
          className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-400 hover:text-white transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
