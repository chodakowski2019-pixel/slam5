// Slam5 — data store

export type TaskCategory = "body" | "mind" | "money";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  projectId: string | null;
  category: TaskCategory;
  isFrog: boolean; // 🐸 Eat the Frog — hardest task first
  timerMinutes: number;
  timerSecondsLeft: number | null; // null = not started
  timerRunning: boolean;
  createdAt: string;
  completedAt: string | null;
  points: number; // +10 per completion
  scheduledFor?: string; // YYYY-MM-DD — if set, task appears on this date instead of createdAt date
}

export interface Project {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: string; // ISO date
  horizon: "6m" | "1y" | "3y" | "5y";
  progress: number; // 0-100
  milestones: Milestone[];
  projectId: string | null;
  completed: boolean;
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface ParkingLotItem {
  id: string;
  text: string;
  createdAt: string;
}

export interface DayRecord {
  date: string; // YYYY-MM-DD
  tasksTotal: number;
  tasksCompleted: number;
  won: boolean; // all tasks completed
  points: number;
}

export interface Subscription {
  status: "active" | "trialing" | "cancelled" | "past_due" | "none";
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  currentPeriodEnd: string | null; // ISO date
}

export interface UserProfile {
  name: string;
  phoneNumber: string;
  bodyGoal: string;
  mindGoal: string;
  moneyGoal: string;
  planTime: "morning" | "evening";
  planHour: string;
  onboardingCompleted: boolean;
  timezone?: string;
}

export interface StoreData {
  tasks: Task[];
  projects: Project[];
  goals: Goal[];
  parkingLot: ParkingLotItem[];
  dayRecords: DayRecord[];
  totalPoints: number;
  subscription?: Subscription;
  profile?: UserProfile;
  phoneNumber?: string; // legacy, use profile.phoneNumber
  // Track deleted IDs so server can remove them without delete-all
  deletedTaskIds?: string[];
  deletedProjectIds?: string[];
  deletedGoalIds?: string[];
  deletedParkingIds?: string[];
}

const STORE_KEY = "slam5-data";

const DEFAULT_DATA: StoreData = {
  tasks: [],
  projects: [],
  goals: [],
  parkingLot: [],
  dayRecords: [],
  totalPoints: 0,
};

export function loadStore(): StoreData {
  if (typeof window === "undefined") return DEFAULT_DATA;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return DEFAULT_DATA;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_DATA;
  }
}

export function saveStore(data: StoreData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}
