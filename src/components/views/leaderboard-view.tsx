"use client";

import { useState } from "react";
import { Copy, Check, Trophy, Flame, Crown } from "lucide-react";
import { useStore } from "@/lib/store-context";
import { Input } from "@/components/ui/input";

interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  streak: number;
  todayWon: boolean | null;
  rank: number;
}

function useMockLeaderboard(): LeaderboardEntry[] {
  const { data, getCurrentStreak, getTodayRecord } = useStore();
  const todayRecord = getTodayRecord();

  return [
    {
      id: "me",
      name: data.profile?.name || "You",
      points: data.totalPoints,
      streak: getCurrentStreak(),
      todayWon: todayRecord ? todayRecord.won : null,
      rank: 1,
    },
  ];
}

export function LeaderboardView() {
  const entries = useMockLeaderboard();
  const [copied, setCopied] = useState(false);

  const inviteLink = typeof window !== "undefined"
    ? `${window.location.origin}/invite/demo`
    : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold">Leaderboard</h2>
      </div>

      {/* Invite */}
      <div className="p-5 rounded-2xl border border-border bg-card mb-6">
        <h3 className="text-sm font-medium mb-1">Invite a friend</h3>
        <p className="text-xs text-muted-foreground mb-4">
          They see your score. You see theirs. Competition helps.
        </p>
        <div className="flex gap-2">
          <Input
            value={inviteLink}
            readOnly
            className="flex-1 bg-background border-border text-xs"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 transition-all duration-200 text-xs flex items-center gap-1.5 font-medium hover:scale-[1.02] active:scale-[0.98]"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Rankings */}
      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-200 ${
              entry.id === "me"
                ? "border-indigo-500/20 bg-indigo-500/5"
                : "border-border bg-card"
            }`}
          >
            <div className="w-8 text-center">
              {entry.rank === 1 ? (
                <Crown size={20} className="text-amber-400 mx-auto" />
              ) : (
                <span className="text-lg font-heading font-bold text-muted-foreground">
                  {entry.rank}
                </span>
              )}
            </div>

            <div className="flex-1">
              <span className="font-medium text-sm">{entry.name}</span>
              <div className="flex items-center gap-2 mt-0.5">
                {entry.todayWon === true && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <Trophy size={10} /> WON
                  </span>
                )}
                {entry.todayWon === false && (
                  <span className="text-xs text-red-400">LOST</span>
                )}
                {entry.todayWon === null && (
                  <span className="text-xs text-muted-foreground">In progress...</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 text-sm">
              <Flame size={14} className={entry.streak > 0 ? "text-orange-400" : "text-muted-foreground"} />
              <span className="font-mono text-xs">{entry.streak}d</span>
            </div>

            <div className="text-right">
              <span className="text-lg font-heading font-bold text-indigo-400">{entry.points}</span>
              <span className="text-xs text-muted-foreground ml-1">pts</span>
            </div>
          </div>
        ))}

        {entries.length <= 1 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            <p>No friends yet. Share your link.</p>
          </div>
        )}
      </div>
    </div>
  );
}
