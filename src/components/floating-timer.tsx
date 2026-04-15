"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MonitorUp, X } from "lucide-react";
import { useStore } from "@/lib/store-context";

export function FloatingTimer() {
  const { data, updateTaskTimer } = useStore();
  const runningTask = data.tasks.find((t) => t.timerRunning);
  const pausedTask = data.tasks.find(
    (t) =>
      t.timerSecondsLeft !== null &&
      t.timerSecondsLeft > 0 &&
      !t.timerRunning &&
      !t.completed
  );
  const activeTask = runningTask || pausedTask;

  const [pipActive, setPipActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const dataRef = useRef(data);
  const updateTaskTimerRef = useRef(updateTaskTimer);
  dataRef.current = data;
  updateTaskTimerRef.current = updateTaskTimer;

  // BroadcastChannel — sync timer state to popup window
  useEffect(() => {
    const channel = new BroadcastChannel("cc-timer");
    channelRef.current = channel;
    channel.onmessage = (e) => {
      if (e.data.type === "request-sync") {
        const tasks = dataRef.current.tasks;
        const task = tasks.find((t) => t.timerRunning) ||
          tasks.find((t) => t.timerSecondsLeft !== null && t.timerSecondsLeft > 0 && !t.timerRunning && !t.completed);
        channel.postMessage({
          type: "sync",
          timer: {
            title: task?.title || "",
            secondsLeft: task?.timerSecondsLeft ?? 0,
            totalSeconds: (task?.timerMinutes ?? 0) * 60,
            running: !!tasks.find((t) => t.timerRunning),
          },
        });
      } else if (e.data.type === "pause") {
        const tasks = dataRef.current.tasks;
        const task = tasks.find((t) => t.timerRunning) ||
          tasks.find((t) => t.timerSecondsLeft !== null && t.timerSecondsLeft > 0 && !t.timerRunning && !t.completed);
        if (task) {
          updateTaskTimerRef.current(task.id, task.timerSecondsLeft, !task.timerRunning);
        }
      } else if (e.data.type === "stop") {
        const tasks = dataRef.current.tasks;
        const task = tasks.find((t) => t.timerRunning) ||
          tasks.find((t) => t.timerSecondsLeft !== null && t.timerSecondsLeft > 0 && !t.timerRunning && !t.completed);
        if (task) {
          updateTaskTimerRef.current(task.id, null, false);
        }
      }
    };
    return () => channel.close();
  }, [data.tasks]);

  // Broadcast on every timer tick
  useEffect(() => {
    const task = data.tasks.find((t) => t.timerRunning) ||
      data.tasks.find((t) => t.timerSecondsLeft !== null && t.timerSecondsLeft > 0 && !t.timerRunning && !t.completed);
    channelRef.current?.postMessage({
      type: "sync",
      timer: {
        title: task?.title || "",
        secondsLeft: task?.timerSecondsLeft ?? 0,
        totalSeconds: (task?.timerMinutes ?? 0) * 60,
        running: !!data.tasks.find((t) => t.timerRunning),
      },
    });
  }, [data.tasks]);

  // Draw timer on canvas
  const drawTimer = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const task = data.tasks.find((t) => t.timerRunning) || data.tasks.find(
      (t) => t.timerSecondsLeft !== null && t.timerSecondsLeft > 0 && !t.timerRunning && !t.completed
    );

    const seconds = task?.timerSecondsLeft ?? 0;
    const total = (task?.timerMinutes ?? 0) * 60;
    const running = !!data.tasks.find((t) => t.timerRunning);
    const title = task?.title || "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const timeStr = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    const pct = total > 0 ? seconds / total : 0;

    // Background
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, 400, 200);

    // Progress bar background
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.roundRect(20, 150, 360, 12, 6);
    ctx.fill();

    // Progress bar fill
    const gradient = ctx.createLinearGradient(20, 0, 380, 0);
    gradient.addColorStop(0, "#10b981");
    gradient.addColorStop(1, "#14b8a6");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(20, 150, 360 * pct, 12, 6);
    ctx.fill();

    // Time
    ctx.fillStyle = running ? "#34d399" : "#60607a";
    ctx.font = "bold 64px monospace";
    ctx.textAlign = "center";
    ctx.fillText(timeStr, 200, 85);

    // Title
    ctx.fillStyle = "#a3a3a3";
    ctx.font = "20px sans-serif";
    const displayTitle = title.length > 28 ? title.slice(0, 28) + "..." : title;
    ctx.fillText(displayTitle, 200, 130);

    // Status dot
    if (running) {
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(20, 20, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    animFrameRef.current = requestAnimationFrame(drawTimer);
  }, [data.tasks]);

  // Setup canvas and video
  useEffect(() => {
    if (!canvasRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 200;
      canvasRef.current = canvas;
    }

    if (!videoRef.current) {
      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      videoRef.current = video;

      const stream = canvasRef.current.captureStream(30);
      video.srcObject = stream;
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Always draw when there's an active task (canvas needs content before PiP opens)
  useEffect(() => {
    if (activeTask) {
      animFrameRef.current = requestAnimationFrame(drawTimer);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeTask, drawTimer]);

  const openPopup = useCallback(() => {
    const w = 240;
    const h = 100;
    const left = window.screen.width - w - 20;
    const top = 40;
    window.open(
      "/timer",
      "cc-timer",
      `width=${w},height=${h},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes`
    );
  }, []);

  const enterPiP = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (video.paused) await video.play();
      await video.requestPictureInPicture();
      setPipActive(true);
      video.addEventListener("leavepictureinpicture", () => setPipActive(false), { once: true });
    } catch {
      // PiP not supported — fallback to popup
      openPopup();
    }
  }, [openPopup]);

  const exitPiP = useCallback(async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      }
    } catch {}
    setPipActive(false);
  }, []);

  const seconds = activeTask?.timerSecondsLeft ?? 0;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeStr = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

  return (
    <>
      {activeTask && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
          {/* Sticky mini timer — always visible */}
          <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border shadow-lg text-sm ${
            runningTask
              ? "bg-[#0d1f17] border-emerald-500/40 text-emerald-400"
              : "bg-card border-border text-muted-foreground"
          }`}>
            {runningTask && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            )}
            <span className="font-mono font-semibold tracking-wider">{timeStr}</span>
            <span className="text-xs truncate max-w-[120px] opacity-70">{activeTask.title}</span>
          </div>

          {/* PiP button */}
          {pipActive ? (
            <button
              onClick={exitPiP}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-card border border-border shadow-lg hover:bg-accent transition-all duration-200 text-sm"
            >
              <X size={14} />
            </button>
          ) : (
            <button
              onClick={enterPiP}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all duration-200 text-sm text-white hover:scale-[1.02] active:scale-[0.98]"
              title="Float timer"
            >
              <MonitorUp size={14} />
            </button>
          )}
        </div>
      )}
    </>
  );
}
