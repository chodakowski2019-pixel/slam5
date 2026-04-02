import csv
import json
import os
import time
import random
import string

CSV_PATH = os.path.expanduser("~/Downloads/90151330508jqjM6YGX.csv")
DATA_PATH = os.path.join(os.path.dirname(__file__), "data.json")

COHORT_MAP = {
    "kwiecień xi": ("KWIECIEŃ XI", "#6366f1"),
    "kwiecień xii": ("KWIECIEŃ XII", "#10b981"),
    "marzec xi": ("MARZEC XI", "#f59e0b"),
    "marzec xii": ("MARZEC XII", "#ec4899"),
    "styczeń ix": ("STYCZEŃ IX", "#8b5cf6"),
    "styczeń x": ("STYCZEŃ X", "#06b6d4"),
    "luty x": ("LUTY X", "#ef4444"),
    "brak zakupu": ("Brak zakupu", "#71717a"),
    "zimne leady (zaproszenie)": ("Zimne leady", "#3b82f6"),
    "zimny lead": ("Zimne leady", "#3b82f6"),
    "lista oczekujących": ("Lista oczekujących", "#a855f7"),
    "koniec subskrybcji": ("Koniec subskrypcji", "#f97316"),
    "czarna lista": ("Czarna lista", "#dc2626"),
    "nie chce być modelką": ("Nie chce być modelką", "#64748b"),
}

def gen_id():
    t = hex(int(time.time() * 1000))[2:]
    r = ''.join(random.choices(string.ascii_lowercase + string.digits, k=5))
    return t + r

# Load data
with open(DATA_PATH) as f:
    data = json.load(f)

# Reset CRM data for clean import
data["crmPersons"] = []
data["crmCohorts"] = []
data.setdefault("crmColumns", [])

# Create cohorts
cohort_ids = {}
seen_names = set()
for key, (name, color) in COHORT_MAP.items():
    if name not in seen_names:
        cid = gen_id()
        data["crmCohorts"].append({
            "id": cid,
            "name": name,
            "color": color,
            "createdAt": "2026-03-31T00:00:00.000Z"
        })
        cohort_ids[name] = cid
        seen_names.add(name)
    # Map status key to cohort id
    cohort_ids[key] = cohort_ids[name]

# Read CSV
with open(CSV_PATH, newline='', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)

    imported = 0
    skipped = 0

    for row in reader:
        if len(row) < 4:
            skipped += 1
            continue

        name = row[1].strip()
        status = row[3].strip().replace('\xa0', ' ').lower()
        content = row[2].strip() if len(row) > 2 else ""

        if not name:
            skipped += 1
            continue

        cid = cohort_ids.get(status)
        if not cid:
            skipped += 1
            continue

        person = {
            "id": gen_id(),
            "firstName": "",
            "lastName": name,
            "email": "",
            "instagram": "",
            "phone": "",
            "cohortId": cid,
            "payments": [False] * 6,
            "needsInvoice": False,
            "notes": content[:500] if content else "",
            "customFields": {},
            "createdAt": "2026-03-31T00:00:00.000Z"
        }

        data["crmPersons"].append(person)
        imported += 1

# Save
with open(DATA_PATH, 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Imported: {imported}")
print(f"Skipped: {skipped}")
print(f"Total: {len(data['crmPersons'])}")
print()
for c in data["crmCohorts"]:
    count = len([p for p in data["crmPersons"] if p["cohortId"] == c["id"]])
    print(f"  {c['name']}: {count}")
