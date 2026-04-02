"use client";

import { useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task } from "@/lib/store";
import { useStore } from "@/lib/store-context";

interface TaskTimerProps {
  task: Task;
  compact?: boolean;
}

export function TaskTimer({ task, compact = false }: TaskTimerProps) {
  const { updateTaskTimer } = useStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notifiedRef = useRef(false);

  const totalSeconds = task.timerMinutes * 60;
  const secondsLeft = task.timerSecondsLeft ?? totalSeconds;
  const isRunning = task.timerRunning;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progress = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  const handleTimerEnd = useCallback(() => {
    if (!notifiedRef.current && "Notification" in window) {
      notifiedRef.current = true;
      if (Notification.permission === "granted") {
        new Notification("Timer done!", { body: task.title });
      }
    }
  }, [task.title]);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      notifiedRef.current = false;
      intervalRef.current = setInterval(() => {
        updateTaskTimer(task.id, Math.max(0, secondsLeft - 1), secondsLeft - 1 > 0);
        if (secondsLeft - 1 <= 0) {
          handleTimerEnd();
        }
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, secondsLeft, task.id, updateTaskTimer, handleTimerEnd]);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const start = () => {
    const secs = task.timerSecondsLeft ?? totalSeconds;
    updateTaskTimer(task.id, secs, true);
  };

  const pause = () => {
    updateTaskTimer(task.id, secondsLeft, false);
  };

  const reset = () => {
    updateTaskTimer(task.id, totalSeconds, false);
    notifiedRef.current = false;
  };

  const timerDone = secondsLeft === 0;

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            "text-xs font-mono tabular-nums",
            timerDone ? "text-emerald-400" : isRunning ? "text-indigo-400" : "text-muted-foreground"
          )}
        >
          {formatTime(secondsLeft)}
        </span>
        {!timerDone && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              isRunning ? pause() : start();
            }}
            className="p-0.5 rounded hover:bg-accent transition-colors"
          >
            {isRunning ? <Pause size={12} /> : <Play size={12} />}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Progress ring */}
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-border"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeDasharray={`${2 * Math.PI * 20}`}
            strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
            strokeLinecap="round"
            className={cn(
              "transition-all duration-1000",
              timerDone ? "text-emerald-400" : "text-indigo-500"
            )}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={cn(
              "text-[10px] font-mono tabular-nums font-medium",
              timerDone ? "text-emerald-400" : isRunning ? "text-indigo-400" : "text-muted-foreground"
            )}
          >
            {formatTime(secondsLeft)}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-1">
        {timerDone ? (
          <button
            onClick={reset}
            className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          >
            <RotateCcw size={14} />
          </button>
        ) : (
          <>
            <button
              onClick={isRunning ? pause : start}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                isRunning
                  ? "bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30"
                  : "hover:bg-accent text-muted-foreground hover:text-foreground"
              )}
            >
              {isRunning ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button
              onClick={reset}
              className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            >
              <RotateCcw size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
