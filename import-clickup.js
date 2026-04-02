// Import ClickUp CSV into Command Center data.json
const fs = require("fs");
const path = require("path");

const CSV_PATH = path.join(process.env.HOME, "Downloads/90151330508jqjM6YGX.csv");
const DATA_PATH = path.join(__dirname, "data.json");

// Simple CSV parser that handles quoted fields with commas
function parseCSV(text) {
  const lines = [];
  let current = "";
  let inQuotes = false;
  let row = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      row.push(current.trim());
      current = "";
    } else if (ch === "\n" && !inQuotes) {
      row.push(current.trim());
      if (row.length > 1) lines.push(row);
      row = [];
      current = "";
    } else {
      current += ch;
    }
  }
  if (current || row.length) {
    row.push(current.trim());
    if (row.length > 1) lines.push(row);
  }
  return lines;
}

// Status → cohort mapping
const COHORT_MAP = {
  "kwiecień xi": { name: "KWIECIEŃ XI", color: "#6366f1" },
  "kwiecień xii": { name: "KWIECIEŃ XII", color: "#10b981" },
  "marzec xi": { name: "MARZEC XI", color: "#f59e0b" },
  "marzec xii": { name: "MARZEC XII", color: "#ec4899" },
  "styczeń ix": { name: "STYCZEŃ IX", color: "#8b5cf6" },
  "styczeń x": { name: "STYCZEŃ X", color: "#06b6d4" },
  "luty x": { name: "LUTY X", color: "#ef4444" },
  "brak zakupu": { name: "Brak zakupu", color: "#71717a" },
  "zimne leady (zaproszenie)": { name: "Zimne leady", color: "#3b82f6" },
  "lista oczekujących": { name: "Lista oczekujących", color: "#a855f7" },
  "koniec subskrybcji": { name: "Koniec subskrypcji", color: "#f97316" },
  "czarna lista": { name: "Czarna lista", color: "#dc2626" },
  "nie chce być modelką": { name: "Nie chce być modelką", color: "#64748b" },
  "zimny lead": { name: "Zimne leady", color: "#3b82f6" },
};

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Read CSV
const csvText = fs.readFileSync(CSV_PATH, "utf-8");
const rows = parseCSV(csvText);
const header = rows[0];
const dataRows = rows.slice(1);

console.log(`Parsed ${dataRows.length} rows`);
console.log(`Columns: ${header.join(" | ")}`);

// Find column indices
const nameIdx = header.findIndex((h) => h.includes("Task Name"));
const statusIdx = header.findIndex((h) => h === "Status");
const contentIdx = header.findIndex((h) => h.includes("Task Content"));

console.log(`Name col: ${nameIdx}, Status col: ${statusIdx}, Content col: ${contentIdx}`);

// Load existing data
const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
data.crmPersons = data.crmPersons || [];
data.crmCohorts = data.crmCohorts || [];
data.crmColumns = data.crmColumns || [];

// Create cohorts
const cohortIds = {};
for (const [key, val] of Object.entries(COHORT_MAP)) {
  const existing = data.crmCohorts.find((c) => c.name === val.name);
  if (existing) {
    cohortIds[key] = existing.id;
  } else {
    const id = generateId();
    data.crmCohorts.push({ id, name: val.name, color: val.color, createdAt: new Date().toISOString() });
    cohortIds[key] = id;
  }
}

// Import persons
let imported = 0;
let skipped = 0;

for (const row of dataRows) {
  const name = (row[nameIdx] || "").trim();
  const status = (row[statusIdx] || "").trim().toLowerCase();
  const content = (row[contentIdx] || "").trim();

  if (!name) {
    skipped++;
    continue;
  }

  // Check if this status maps to a cohort
  const cohortId = cohortIds[status];
  if (!cohortId) {
    skipped++;
    continue;
  }

  // Check for duplicates
  const exists = data.crmPersons.find(
    (p) => p.lastName === name && p.cohortId === cohortId
  );
  if (exists) {
    skipped++;
    continue;
  }

  const person = {
    id: generateId(),
    firstName: "",
    lastName: name,
    email: "",
    instagram: "",
    phone: "",
    cohortId,
    payments: [false, false, false, false, false, false],
    needsInvoice: false,
    notes: content.slice(0, 500), // First 500 chars of content as notes
    customFields: {},
    createdAt: new Date().toISOString(),
  };

  data.crmPersons.push(person);
  imported++;
}

// Save
fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");

console.log(`\nDone!`);
console.log(`Imported: ${imported}`);
console.log(`Skipped: ${skipped}`);
console.log(`Total persons in CRM: ${data.crmPersons.length}`);
console.log(`Cohorts: ${data.crmCohorts.map((c) => `${c.name} (${data.crmPersons.filter(p => p.cohortId === c.id).length})`).join(", ")}`);
