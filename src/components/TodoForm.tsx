"use client";

import { useState } from "react";
import { usePerson } from "@/lib/person-context";
import type { Category, Recurrence } from "@/lib/types";
import { CATEGORY_ORDER, CATEGORY_META } from "@/lib/categories";

const inputClass =
  "rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200 dark:border-white/10 dark:bg-white/5 dark:focus:border-rose-500/50 dark:focus:ring-rose-500/20";

export function TodoForm({ onCreated }: { onCreated: () => void }) {
  const { personId } = usePerson();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("regular");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [recurrence, setRecurrence] = useState<Recurrence>("none");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);

    let dueAt: string | null = null;
    if (dueDate) {
      dueAt = new Date(`${dueDate}T${dueTime || "09:00"}`).toISOString();
    }

    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        category,
        dueAt,
        recurrence,
        createdById: personId,
      }),
    });

    setTitle("");
    setCategory("regular");
    setDueDate("");
    setDueTime("");
    setRecurrence("none");
    setSubmitting(false);
    setOpen(false);
    onCreated();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mx-4 mt-4 rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/50 py-3.5 text-sm font-medium text-rose-700 transition hover:bg-rose-50 active:scale-[0.99] dark:border-rose-500/20 dark:bg-rose-500/5 dark:text-rose-300"
      >
        ✨ Add a to-do
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-4 mt-4 flex flex-col gap-3 rounded-2xl border border-black/10 bg-white/60 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.03]"
    >
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Clean the house, monthly Bible study…"
        className={inputClass}
      />

      <div className="flex flex-wrap gap-2">
        {CATEGORY_ORDER.map((c) => {
          const meta = CATEGORY_META[c];
          const selected = category === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                selected
                  ? meta.chip + " ring-2 ring-offset-1 ring-black/10 dark:ring-white/20"
                  : "bg-black/5 text-black/50 hover:bg-black/10 dark:bg-white/5 dark:text-white/50"
              }`}
            >
              {meta.emoji} {meta.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className={inputClass}
        />
        <input
          type="time"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
          disabled={!dueDate}
          className={`${inputClass} disabled:opacity-40`}
        />
        <select
          value={recurrence}
          onChange={(e) => setRecurrence(e.target.value as Recurrence)}
          className={inputClass}
        >
          <option value="none">One-off</option>
          <option value="daily">Repeats daily</option>
          <option value="weekly">Repeats weekly</option>
          <option value="monthly">Repeats monthly</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-xl px-4 py-2 text-sm opacity-60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || !title.trim()}
          className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-rose-600 active:scale-[0.98] disabled:opacity-40"
        >
          Add
        </button>
      </div>
    </form>
  );
}
