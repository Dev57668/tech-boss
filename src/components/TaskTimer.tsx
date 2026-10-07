import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, Bell } from 'lucide-react';
import { sound } from '../utils/sound';

interface TaskTimerProps {
  onTimerZero?: () => void;
  onTimerExpired?: () => void;
}

export const TaskTimer: React.FC<TaskTimerProps> = ({ onTimerZero, onTimerExpired }) => {
  const [initialSeconds, setInitialSeconds] = useState<number>(300); // 5 min default
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            sound.play('alert');
            onTimerZero?.();
            onTimerExpired?.();
            return 0;
          }
          if (prev <= 11 && prev > 1) {
            // Last-10-seconds audio warning beep
            sound.play('beep');
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsRemaining, onTimerZero, onTimerExpired]);

  const handleStart = () => {
    if (secondsRemaining === 0) {
      setSecondsRemaining(initialSeconds);
    }
    sound.play('click');
    setIsRunning(true);
  };

  const handlePause = () => {
    sound.play('click');
    setIsRunning(false);
  };

  const handleReset = (newInitial?: number) => {
    sound.play('click');
    setIsRunning(false);
    const secs = newInitial !== undefined ? newInitial : initialSeconds;
    if (newInitial !== undefined) {
      setInitialSeconds(newInitial);
    }
    setSecondsRemaining(secs);
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLastTenSeconds = isRunning && secondsRemaining <= 10 && secondsRemaining > 0;
  const isExpired = secondsRemaining === 0;

  return (
    <div
      className={`rounded-3xl border p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between ${
        isLastTenSeconds
          ? 'border-rose-500 bg-[#fff5f5] shadow-[0_0_30px_rgba(244,63,94,0.15)] ring-2 ring-rose-500 animate-pulse'
          : isExpired
          ? 'border-[#dcdcd3] bg-[#f8f8f4]'
          : 'border-[#dcdcd3] bg-[#ffffff] shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
      }`}
    >
      <div>
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#eeeee8]">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center ${
                isLastTenSeconds
                  ? 'bg-rose-600 text-white animate-bounce'
                  : 'bg-[#0d0e10] text-[#d4ff3a]'
              }`}
            >
              <Timer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-black text-base tracking-tight text-[#0d0e10] uppercase flex items-center gap-2">
                TASK COUNTDOWN
                {isLastTenSeconds && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-600 text-white font-bold animate-ping">
                    WARNING
                  </span>
                )}
              </h3>
              <p className="text-xs text-[#75766f]">Official house challenge timer</p>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleReset(60)}
              className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#f4f4ee] hover:bg-[#0d0e10] hover:text-white text-[#0d0e10] transition-colors"
            >
              1M
            </button>
            <button
              onClick={() => handleReset(120)}
              className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#f4f4ee] hover:bg-[#0d0e10] hover:text-white text-[#0d0e10] transition-colors"
            >
              2M
            </button>
            <button
              onClick={() => handleReset(300)}
              className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#f4f4ee] hover:bg-[#0d0e10] hover:text-white text-[#0d0e10] transition-colors"
            >
              5M
            </button>
          </div>
        </div>

        {/* Clock Face */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3">
          <div className="flex items-baseline gap-2">
            <span
              className={`font-mono font-black text-4xl sm:text-5xl md:text-6xl tracking-tight transition-colors ${
                isLastTenSeconds
                  ? 'text-rose-600 scale-105'
                  : isExpired
                  ? 'text-[#75766f]'
                  : 'text-[#0d0e10]'
              }`}
            >
              {formatTime(secondsRemaining)}
            </span>
            <span className="text-xs font-mono text-[#75766f] uppercase">
              {isRunning ? 'RUNNING' : isExpired ? 'TIME OVER' : 'STOPPED'}
            </span>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-2">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="framer-lime-btn px-5 py-2.5 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-[#0d0e10]" />
                <span>START</span>
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="px-5 py-2.5 rounded-full bg-[#0d0e10] hover:bg-[#202227] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
              >
                <Pause className="w-3.5 h-3.5 fill-white" />
                <span>PAUSE</span>
              </button>
            )}

            <button
              onClick={() => handleReset()}
              className="p-2.5 rounded-full bg-[#f4f4ee] hover:bg-[#e6e6dc] text-[#0d0e10] border border-[#dcdcd3] transition-all"
              title="Reset countdown"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {isLastTenSeconds && (
        <div className="mt-2 text-center text-xs font-mono font-bold text-rose-600 flex items-center justify-center gap-1.5 animate-pulse">
          <Bell className="w-3.5 h-3.5" />
          FINAL 10 SECONDS! TASK AUDIT IMMINENT!
        </div>
      )}
    </div>
  );
};
