"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MonitorUp, X } from "lucide-react";
import { useStore } from "@/lib/store-context";

const CHANNEL_NAME = "cc-timer";

export function FloatingTimer() {
  const { data, updateTaskTimer } = useStore();
  const runningTask = data.tasks.find((t) => t.timerRunning);
  const [popupOpen, setPopupOpen] = useState(false);
  const popupRef = useRef<Window | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

  const pausedTask = data.tasks.find(
    (t) =>
      t.timerSecondsLeft !== null &&
      t.timerSecondsLeft > 0 &&
      !t.timerRunning &&
      !t.completed
  );
  const activeTask = runningTask || pausedTask;

  // Setup BroadcastChannel — send data to popup, receive commands back
  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    channel.onmessage = (e) => {
      const { type } = e.data;

      if (type === "request-sync") {
        // Popup just opened, send current state
        sendSync(channel);
        return;
      }

      if (type === "pause") {
        const running = data.tasks.find((t) => t.timerRunning);
        if (running) {
          updateTaskTimer(running.id, running.timerSecondsLeft, false);
        } else {
          const paused = data.tasks.find(
            (t) =>
              t.timerSecondsLeft !== null &&
              t.timerSecondsLeft > 0 &&
              !t.timerRunning &&
              !t.completed
          );
          if (paused) {
            updateTaskTimer(paused.id, paused.timerSecondsLeft, true);
          }
        }
      } else if (type === "stop") {
        const running = data.tasks.find((t) => t.timerRunning);
        if (running) {
          updateTaskTimer(running.id, running.timerMinutes * 60, false);
        }
        closePopup();
      }
    };

    return () => channel.close();
  }, [data.tasks, updateTaskTimer]);

  const sendSync = useCallback(
    (channel?: BroadcastChannel) => {
      const ch = channel || channelRef.current;
      if (!ch) return;
      const task = activeTask;
      ch.postMessage({
        type: "sync",
        timer: {
          title: task?.title || "",
          secondsLeft: task?.timerSecondsLeft ?? 0,
          totalSeconds: (task?.timerMinutes ?? 0) * 60,
          running: !!runningTask,
        },
      });
    },
    [activeTask, runningTask]
  );

  // Push timer updates to popup every 250ms
  useEffect(() => {
    if (!popupOpen) return;
    const interval = setInterval(() => sendSync(), 250);
    return () => clearInterval(interval);
  }, [popupOpen, sendSync]);

  // Detect popup closed by user
  useEffect(() => {
    if (!popupOpen) return;
    const interval = setInterval(() => {
      if (popupRef.current && popupRef.current.closed) {
        popupRef.current = null;
        setPopupOpen(false);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [popupOpen]);

  const openPopup = useCallback(() => {
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.focus();
      return;
    }

    const w = 240;
    const h = 100;
    const left = window.screen.width - w - 20;
    const top = 40;

    const popup = window.open(
      "/timer",
      "cc-timer",
      `width=${w},height=${h},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes`
    );

    if (popup) {
      popupRef.current = popup;
      setPopupOpen(true);
    }
  }, []);

  const closePopup = useCallback(() => {
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }
    popupRef.current = null;
    setPopupOpen(false);
  }, []);

  return (
    <>
      {activeTask && (
        <div className="fixed bottom-4 right-4 z-50">
          {popupOpen ? (
            <button
              onClick={closePopup}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border shadow-lg hover:bg-accent transition-colors text-sm"
            >
              <X size={14} />
              Close float
            </button>
          ) : (
            <button
              onClick={openPopup}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 shadow-lg transition-colors text-sm text-white"
            >
              <MonitorUp size={14} />
              Float timer
            </button>
          )}
        </div>
      )}
    </>
  );
}
