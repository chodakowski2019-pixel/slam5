// Simple client-side store with localStorage persistence

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  projectId: string | null;
  timerMinutes: number;
  timerSecondsLeft: number | null; // null = not started
  timerRunning: boolean;
  createdAt: string;
  completedAt: string | null;
}

export interface Project {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  createdAt: string;
}

export interface FinanceEntry {
  id: string;
  type: "income" | "expense";
  amount: number;
  currency: "USD" | "PLN" | "EUR";
  category: string;
  description: string;
  projectId: string | null;
  date: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NoteFolder {
  id: string;
  name: string;
  color: string;
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

export interface CrmPerson {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  instagram: string;
  phone: string;
  cohortId: string;
  payments: boolean[]; // 6 months
  notes: string;
  needsInvoice: boolean;
  customFields: Record<string, string>;
  createdAt: string;
}

export interface CrmCohort {
  id: string;
  name: string; // e.g. "MARZEC XI"
  color: string;
  createdAt: string;
}

export interface CrmCustomColumn {
  id: string;
  name: string;
}

export interface StoreData {
  tasks: Task[];
  projects: Project[];
  finances: FinanceEntry[];
  notes: Note[];
  noteFolders: NoteFolder[];
  goals: Goal[];
  crmPersons: CrmPerson[];
  crmCohorts: CrmCohort[];
  crmColumns: CrmCustomColumn[];
}

const STORE_KEY = "command-center-data";

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "omg",
    name: "PROJECT_B",
    emoji: "O",
    color: "#ec4899",
    description: "Fashion/modeling education platform",
    createdAt: new Date().toISOString(),
  },
  {
    id: "itera",
    name: "Itera City",
    emoji: "I",
    color: "#6366f1",
    description: "AI city guide mobile app",
    createdAt: new Date().toISOString(),
  },
  {
    id: "apigo",
    name: "APIGO",
    emoji: "A",
    color: "#10b981",
    description: "Personal AI mobile apps platform",
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_DATA: StoreData = {
  tasks: [],
  projects: DEFAULT_PROJECTS,
  finances: [],
  notes: [],
  noteFolders: [
    { id: "notes", name: "Notes", color: "#6366f1" },
  ],
  goals: [],
  crmPersons: [],
  crmCohorts: [],
  crmColumns: [],
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
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
