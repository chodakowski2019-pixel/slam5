"use client";

import { useState } from "react";
import { Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store-context";
import { FinanceEntry } from "@/lib/store";

const CATEGORIES = [
  "Project income",
  "Freelance",
  "Subscription",
  "Food",
  "Transport",
  "Software",
  "Marketing",
  "Legal",
  "Other",
];

export function FinancesView() {
  const { data, addFinance, deleteFinance } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<"income" | "expense">("income");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<"USD" | "PLN" | "EUR">("USD");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);

  const handleAdd = () => {
    if (!amount || !description.trim()) return;
    addFinance({
      type,
      amount: Number(amount),
      currency,
      category,
      description: description.trim(),
      projectId,
      date: new Date().toISOString(),
    });
    setAmount("");
    setDescription("");
    setShowForm(false);
  };

  const totalIncome = data.finances
    .filter((f) => f.type === "income")
    .reduce((sum, f) => sum + f.amount, 0);
  const totalExpenses = data.finances
    .filter((f) => f.type === "expense")
    .reduce((sum, f) => sum + f.amount, 0);

  const currencySymbol = (c: string) =>
    c === "USD" ? "$" : c === "PLN" ? "zl" : "E";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Finances</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-500 hover:bg-indigo-600 transition-colors text-sm"
        >
          <Plus size={14} />
          Add transaction
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="text-xs text-muted-foreground mb-1">Income</div>
          <div className="text-xl font-semibold text-emerald-400">
            +${totalIncome.toLocaleString()}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="text-xs text-muted-foreground mb-1">Expenses</div>
          <div className="text-xl font-semibold text-red-400">
            -${totalExpenses.toLocaleString()}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="text-xs text-muted-foreground mb-1">Balance</div>
          <div
            className={`text-xl font-semibold ${
              totalIncome - totalExpenses >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            ${(totalIncome - totalExpenses).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="p-4 rounded-xl border border-border bg-card mb-6 space-y-3">
          <div className="flex gap-2">
            <div className="flex rounded-md border border-border overflow-hidden">
              <button
                onClick={() => setType("income")}
                className={`px-3 py-1.5 text-sm transition-colors ${
                  type === "income"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Income
              </button>
              <button
                onClick={() => setType("expense")}
                className={`px-3 py-1.5 text-sm transition-colors ${
                  type === "expense"
                    ? "bg-red-500/20 text-red-400"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Expense
              </button>
            </div>
            <select
              value={currency}
              onChange={(e) =>
                setCurrency(e.target.value as "USD" | "PLN" | "EUR")
              }
              className="bg-background border border-border rounded-md px-2 text-sm outline-none"
            >
              <option value="USD">$ USD</option>
              <option value="PLN">zl PLN</option>
              <option value="EUR">E EUR</option>
            </select>
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-32 bg-background"
            />
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="flex-1 bg-background"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-background border border-border rounded-md px-2 text-sm outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={projectId || ""}
              onChange={(e) => setProjectId(e.target.value || null)}
              className="bg-background border border-border rounded-md px-2 text-sm outline-none"
            >
              <option value="">No project</option>
              {data.projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.emoji} {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!amount || !description.trim()}
              className="px-3 py-1.5 text-sm rounded-md bg-indigo-500 hover:bg-indigo-600 disabled:opacity-30 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Transactions list */}
      <div className="space-y-1">
        {data.finances.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No transactions yet.
          </div>
        )}
        {data.finances.map((entry) => {
          const project = entry.projectId
            ? data.projects.find((p) => p.id === entry.projectId)
            : null;
          return (
            <div
              key={entry.id}
              className="group flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-card transition-colors"
            >
              <div
                className={`p-1.5 rounded-md ${
                  entry.type === "income"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {entry.type === "income" ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm">{entry.description}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{entry.category}</span>
                  {project && (
                    <>
                      <span>.</span>
                      <span style={{ color: project.color }}>
                        {project.emoji} {project.name}
                      </span>
                    </>
                  )}
                  <span>.</span>
                  <span>
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <span
                className={`text-sm font-mono tabular-nums font-medium ${
                  entry.type === "income" ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {entry.type === "income" ? "+" : "-"}
                {currencySymbol(entry.currency)}
                {entry.amount.toLocaleString()}
              </span>
              <button
                onClick={() => deleteFinance(entry.id)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20 hover:text-destructive transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
