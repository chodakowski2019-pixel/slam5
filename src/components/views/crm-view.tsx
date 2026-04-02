"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  X,
  Users,
  Columns3,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store-context";
import { CrmPerson } from "@/lib/store";

const PAYMENT_MONTHS = ["M1", "M2", "M3", "M4", "M5", "M6"];
const COHORT_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#ef4444", "#06b6d4", "#8b5cf6"];

// Detail panel for a person
function PersonDetail({
  person,
  onClose,
}: {
  person: CrmPerson;
  onClose: () => void;
}) {
  const { updateCrmPerson, toggleCrmPayment, data } = useStore();
  const cohort = data.crmCohorts.find((c) => c.id === person.cohortId);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-[480px] bg-card border-l border-border overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-heading font-bold">
                {person.firstName} {person.lastName}
              </h2>
              {cohort && (
                <span
                  className="text-xs px-2 py-0.5 rounded mt-1 inline-block"
                  style={{ backgroundColor: cohort.color + "20", color: cohort.color }}
                >
                  {cohort.name}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-accent transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Contact info */}
          <div className="space-y-3 mb-6">
            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Email
              </label>
              <Input
                value={person.email}
                onChange={(e) => updateCrmPerson(person.id, { email: e.target.value })}
                className="mt-1 bg-background"
              />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Instagram
              </label>
              <Input
                value={person.instagram}
                onChange={(e) => updateCrmPerson(person.id, { instagram: e.target.value })}
                placeholder="@username"
                className="mt-1 bg-background"
              />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Phone
              </label>
              <Input
                value={person.phone}
                onChange={(e) => updateCrmPerson(person.id, { phone: e.target.value })}
                className="mt-1 bg-background"
              />
            </div>

            {/* Custom fields */}
            {data.crmColumns.map((col) => (
              <div key={col.id}>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {col.name}
                </label>
                <Input
                  value={person.customFields[col.id] || ""}
                  onChange={(e) =>
                    updateCrmPerson(person.id, {
                      customFields: { ...person.customFields, [col.id]: e.target.value },
                    })
                  }
                  className="mt-1 bg-background"
                />
              </div>
            ))}
          </div>

          {/* Payments */}
          <div className="mb-6">
            <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">
              Payments (6 months)
            </h3>
            <div className="grid grid-cols-6 gap-2">
              {PAYMENT_MONTHS.map((label, i) => {
                const paid = person.payments[i];
                return (
                  <button
                    key={i}
                    onClick={() => toggleCrmPayment(person.id, i)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors",
                      paid
                        ? "border-emerald-500/30 bg-emerald-500/10"
                        : "border-border hover:bg-accent/30"
                    )}
                  >
                    <span className="text-xs font-medium">{label}</span>
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center text-[10px]",
                        paid
                          ? "bg-emerald-500 text-white"
                          : "bg-border text-muted-foreground"
                      )}
                    >
                      {paid ? "✓" : ""}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {person.payments.filter(Boolean).length}/6 paid
            </div>
          </div>

          {/* Invoice */}
          <div className="mb-6 flex items-center gap-3">
            <Checkbox
              checked={person.needsInvoice || false}
              onCheckedChange={(checked) =>
                updateCrmPerson(person.id, { needsInvoice: !!checked })
              }
            />
            <label className="text-sm">Needs invoice (faktura)</label>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">
              Notes
            </h3>
            <textarea
              value={person.notes}
              onChange={(e) => updateCrmPerson(person.id, { notes: e.target.value })}
              placeholder="Notes about this person..."
              className="w-full h-40 bg-background border border-border rounded-lg p-3 text-sm outline-none resize-none"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CrmView() {
  const {
    data,
    addCrmPerson,
    updateCrmPerson,
    deleteCrmPerson,
    toggleCrmPayment,
    addCrmCohort,
    deleteCrmCohort,
    addCrmColumn,
    deleteCrmColumn,
  } = useStore();

  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [expandedCohorts, setExpandedCohorts] = useState<Set<string>>(new Set());
  const [showNewCohort, setShowNewCohort] = useState(false);
  const [newCohortName, setNewCohortName] = useState("");
  const [newCohortColor, setNewCohortColor] = useState(COHORT_COLORS[0]);
  const [showNewPerson, setShowNewPerson] = useState<string | null>(null); // cohortId
  const [newFirst, setNewFirst] = useState("");
  const [newLast, setNewLast] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newIg, setNewIg] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColName, setNewColName] = useState("");

  const selectedPerson = data.crmPersons.find((p) => p.id === selectedPersonId);

  const toggleCohort = (id: string) => {
    setExpandedCohorts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddCohort = () => {
    if (!newCohortName.trim()) return;
    addCrmCohort(newCohortName.trim(), newCohortColor);
    setNewCohortName("");
    setShowNewCohort(false);
  };

  const handleAddPerson = (cohortId: string) => {
    if (!newFirst.trim() && !newLast.trim()) return;
    addCrmPerson({
      firstName: newFirst.trim(),
      lastName: newLast.trim(),
      email: newEmail.trim(),
      instagram: newIg.trim(),
      phone: newPhone.trim(),
      cohortId,
    });
    setNewFirst("");
    setNewLast("");
    setNewEmail("");
    setNewIg("");
    setNewPhone("");
    setShowNewPerson(null);
  };

  const handleAddColumn = () => {
    if (!newColName.trim()) return;
    addCrmColumn(newColName.trim());
    setNewColName("");
    setShowAddColumn(false);
  };

  // All cohorts expanded by default on first render
  if (expandedCohorts.size === 0 && data.crmCohorts.length > 0) {
    const all = new Set(data.crmCohorts.map((c) => c.id));
    setExpandedCohorts(all);
  }

  const totalPersons = data.crmPersons.length;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-heading font-bold">CRM</h2>
          <span className="text-sm text-muted-foreground">{totalPersons} people</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddColumn(!showAddColumn)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border hover:bg-accent transition-colors text-sm"
          >
            <Columns3 size={14} />
            Add column
          </button>
          <button
            onClick={() => setShowNewCohort(!showNewCohort)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-500 hover:bg-indigo-600 transition-colors text-sm"
          >
            <Plus size={14} />
            New group
          </button>
        </div>
      </div>

      {/* Add column form */}
      {showAddColumn && (
        <div className="flex gap-2 mb-4 items-center">
          <Input
            placeholder="Column name"
            value={newColName}
            onChange={(e) => setNewColName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddColumn()}
            autoFocus
            className="w-48 bg-card"
          />
          <button
            onClick={handleAddColumn}
            disabled={!newColName.trim()}
            className="px-3 py-1.5 text-sm rounded-md bg-indigo-500 hover:bg-indigo-600 disabled:opacity-30 transition-colors"
          >
            Add
          </button>
          <button
            onClick={() => setShowAddColumn(false)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
          {data.crmColumns.length > 0 && (
            <div className="flex gap-1 ml-4">
              {data.crmColumns.map((col) => (
                <span
                  key={col.id}
                  className="flex items-center gap-1 text-xs bg-card border border-border rounded px-2 py-1"
                >
                  {col.name}
                  <button
                    onClick={() => deleteCrmColumn(col.id)}
                    className="hover:text-destructive"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* New cohort form */}
      {showNewCohort && (
        <div className="p-4 rounded-xl border border-border bg-card mb-4 flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">
              Group name
            </label>
            <Input
              placeholder="e.g. MARZEC XI"
              value={newCohortName}
              onChange={(e) => setNewCohortName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCohort()}
              autoFocus
              className="bg-background"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">
              Color
            </label>
            <div className="flex gap-1">
              {COHORT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewCohortColor(c)}
                  className="w-6 h-6 rounded-full transition-transform"
                  style={{
                    backgroundColor: c,
                    transform: newCohortColor === c ? "scale(1.3)" : "scale(1)",
                    outline: newCohortColor === c ? "2px solid white" : "none",
                    outlineOffset: "2px",
                  }}
                />
              ))}
            </div>
          </div>
          <button
            onClick={handleAddCohort}
            disabled={!newCohortName.trim()}
            className="px-3 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 disabled:opacity-30 transition-colors text-sm"
          >
            Create
          </button>
        </div>
      )}

      {/* No cohorts */}
      {data.crmCohorts.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Users size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-sm">No groups yet. Create your first one.</p>
        </div>
      )}

      {/* Cohorts */}
      {data.crmCohorts.map((cohort) => {
        const persons = data.crmPersons.filter((p) => p.cohortId === cohort.id);
        const expanded = expandedCohorts.has(cohort.id);

        return (
          <div key={cohort.id} className="mb-4">
            {/* Cohort header */}
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => toggleCohort(cohort.id)}
                className="p-0.5 rounded hover:bg-accent transition-colors text-muted-foreground"
              >
                {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              <span
                className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded"
                style={{ backgroundColor: cohort.color + "20", color: cohort.color }}
              >
                {cohort.name}
              </span>
              <span className="text-xs text-muted-foreground">{persons.length}</span>
              <button
                onClick={() => deleteCrmCohort(cohort.id)}
                className="ml-auto p-1 rounded hover:bg-destructive/20 hover:text-destructive transition-all text-muted-foreground opacity-0 hover:opacity-100"
              >
                <Trash2 size={12} />
              </button>
            </div>

            {expanded && (
              <>
                {/* Table header */}
                <div className="grid gap-0 text-[10px] text-muted-foreground uppercase tracking-wider border-b border-border pb-1 mb-0.5"
                  style={{
                    gridTemplateColumns: `2fr 2fr 2.5fr 1.5fr 1.5fr 36px ${data.crmColumns.map(() => "1.5fr").join(" ")} repeat(6, 36px) 32px`,
                  }}
                >
                  <span className="px-2">First name</span>
                  <span className="px-2">Last name</span>
                  <span className="px-2">Email</span>
                  <span className="px-2">Instagram</span>
                  <span className="px-2">Phone</span>
                  <span className="text-center">FV</span>
                  {data.crmColumns.map((col) => (
                    <span key={col.id} className="px-2">{col.name}</span>
                  ))}
                  {PAYMENT_MONTHS.map((m) => (
                    <span key={m} className="text-center">{m}</span>
                  ))}
                  <span />
                </div>

                {/* Persons */}
                {persons.map((person) => (
                  <div
                    key={person.id}
                    className="group grid gap-0 items-center py-1.5 border-b border-border/50 hover:bg-accent/20 transition-colors cursor-pointer"
                    style={{
                      gridTemplateColumns: `2fr 2fr 2.5fr 1.5fr 1.5fr 36px ${data.crmColumns.map(() => "1.5fr").join(" ")} repeat(6, 36px) 32px`,
                    }}
                    onClick={() => setSelectedPersonId(person.id)}
                  >
                    <span className="px-2 text-sm font-medium">{person.firstName}</span>
                    <span className="px-2 text-sm">{person.lastName}</span>
                    <span className="px-2 text-sm text-muted-foreground truncate">{person.email}</span>
                    <span className="px-2 text-sm text-muted-foreground truncate">{person.instagram}</span>
                    <span className="px-2 text-sm text-muted-foreground truncate">{person.phone}</span>
                    <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={person.needsInvoice || false}
                        onCheckedChange={() =>
                          updateCrmPerson(person.id, { needsInvoice: !person.needsInvoice })
                        }
                        className="border-muted-foreground/30"
                      />
                    </div>
                    {data.crmColumns.map((col) => (
                      <span key={col.id} className="px-2 text-sm text-muted-foreground truncate">
                        {person.customFields[col.id] || ""}
                      </span>
                    ))}
                    {PAYMENT_MONTHS.map((_, i) => (
                      <div key={i} className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={person.payments[i]}
                          onCheckedChange={() => toggleCrmPayment(person.id, i)}
                          className={cn(
                            "border-muted-foreground/30",
                            person.payments[i] && "border-emerald-500 bg-emerald-500 text-white"
                          )}
                        />
                      </div>
                    ))}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCrmPerson(person.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20 hover:text-destructive transition-all mx-auto"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}

                {/* Add person */}
                {showNewPerson === cohort.id ? (
                  <div
                    className="grid gap-0 items-center py-1.5"
                    style={{
                      gridTemplateColumns: `2fr 2fr 2.5fr 1.5fr 1.5fr 36px ${data.crmColumns.map(() => "1.5fr").join(" ")} repeat(6, 36px) 32px`,
                    }}
                  >
                    <div className="px-1">
                      <Input
                        placeholder="First"
                        value={newFirst}
                        onChange={(e) => setNewFirst(e.target.value)}
                        autoFocus
                        className="h-7 text-xs bg-background"
                      />
                    </div>
                    <div className="px-1">
                      <Input
                        placeholder="Last"
                        value={newLast}
                        onChange={(e) => setNewLast(e.target.value)}
                        className="h-7 text-xs bg-background"
                      />
                    </div>
                    <div className="px-1">
                      <Input
                        placeholder="Email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="h-7 text-xs bg-background"
                      />
                    </div>
                    <div className="px-1">
                      <Input
                        placeholder="@ig"
                        value={newIg}
                        onChange={(e) => setNewIg(e.target.value)}
                        className="h-7 text-xs bg-background"
                      />
                    </div>
                    <div className="px-1">
                      <Input
                        placeholder="Phone"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddPerson(cohort.id)}
                        className="h-7 text-xs bg-background"
                      />
                    </div>
                    <span /> {/* FV placeholder */}
                    {data.crmColumns.map(() => (
                      <span key={Math.random()} />
                    ))}
                    <div className="col-span-6" />
                    <button
                      onClick={() => handleAddPerson(cohort.id)}
                      disabled={!newFirst.trim() && !newLast.trim()}
                      className="p-1 rounded bg-indigo-500 hover:bg-indigo-600 disabled:opacity-30 transition-colors mx-auto"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowNewPerson(cohort.id)}
                    className="flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Plus size={14} />
                    Add person
                  </button>
                )}
              </>
            )}
          </div>
        );
      })}

      {/* Detail panel */}
      {selectedPerson && (
        <PersonDetail
          person={selectedPerson}
          onClose={() => setSelectedPersonId(null)}
        />
      )}
    </div>
  );
}
