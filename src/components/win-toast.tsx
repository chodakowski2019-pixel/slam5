"use client";

import { useEffect, useState } from "react";

interface WinToastProps {
  message: string | null;
  points: number;
  onDone: () => void;
}

export function WinToast({ message, points, onDone }: WinToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDone, 300);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [message, onDone]);

  if (!message) return null;

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <div className="bg-card border border-emerald-500/30 rounded-xl px-6 py-3 shadow-2xl flex items-center gap-3">
        <span className="text-emerald-400 font-bold text-sm">+{points}</span>
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
}
