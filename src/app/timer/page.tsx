"use client";

import { useEffect, useState, useRef, useCallback } from "react";

const CHANNEL_NAME = "cc-timer";

interface TimerData {
  title: string;
  secondsLeft: number;
  totalSeconds: number;
  running: boolean;
}

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function TimerPage() {
  const [timer, setTimer] = useState<TimerData>({
    title: "",
    secondsLeft: 0,
    totalSeconds: 0,
    running: false,
  });
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    channel.onmessage = (e) => {
      if (e.data.type === "sync") {
        setTimer(e.data.timer);
      }
    };

    // Request initial sync from main window
    channel.postMessage({ type: "request-sync" });

    return () => channel.close();
  }, []);

  const sendCommand = useCallback((cmd: "pause" | "stop") => {
    channelRef.current?.postMessage({ type: cmd });
  }, []);

  const { title, secondsLeft, totalSeconds, running } = timer;
  const pct =
    totalSeconds > 0
      ? ((totalSeconds - secondsLeft) / totalSeconds) * 100
      : 0;
  const timerColor = !running
    ? "#71717a"
    : secondsLeft <= 60
    ? "#f87171"
    : "#6ee7b7";
  const barColor = secondsLeft <= 60 ? "#f87171" : "#10b981";

  return (
    <div
      style={{
        background: "#0a0a0b",
        color: "#fafafa",
        fontFamily: "-apple-system, system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: "8px 14px",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      <div
        style={{
          fontSize: 9,
          color: "#71717a",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 1,
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {title || "No active timer"}
      </div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          color: timerColor,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
        }}
      >
        {formatTime(secondsLeft)}
      </div>
      <div
        style={{
          display: "flex",
          gap: 6,
          marginTop: 4,
          alignItems: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            flex: 1,
            height: 3,
            background: "#1c1c1e",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: barColor,
              borderRadius: 2,
              width: `${pct}%`,
              transition: "width 1s linear",
            }}
          />
        </div>
        <button
          onClick={() => sendCommand("pause")}
          style={{
            background: running ? "#27272a" : "#10b981",
            color: "#fafafa",
            border: "none",
            padding: "3px 10px",
            borderRadius: 5,
            fontSize: 10,
            cursor: "pointer",
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          {running ? "Pause" : "Resume"}
        </button>
        <button
          onClick={() => sendCommand("stop")}
          style={{
            background: "none",
            color: "#71717a",
            border: "none",
            padding: "3px 6px",
            borderRadius: 5,
            fontSize: 10,
            cursor: "pointer",
          }}
        >
          Stop
        </button>
      </div>
    </div>
  );
}
