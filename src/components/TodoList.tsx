"use client";

import Link from "next/link";
import type { Category, Todo } from "@/lib/types";

const recurrenceLabel: Record<Todo["recurrence"], string> = {
  none: "",
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

function TodoRow({
  t,
  done,
  onToggleDone,
  onDelete,
  accentClass,
}: {
  t: Todo;
  done: boolean;
  onToggleDone: (id: string, done: boolean) => void;
  onDelete: (id: string) => void;
  accentClass: string;
}) {
  return (
    <li
      className={`flex items-center gap-3 rounded-xl border border-black/5 border-l-4 bg-white/70 p-3 shadow-sm transition dark:border-white/5 dark:bg-white/[0.03] ${
        done ? "opacity-50" : accentClass
      }`}
    >
      <input
        type="checkbox"
        checked={done}
        onChange={() => onToggleDone(t.id, !done)}
        className="h-5 w-5 shrink-0 accent-rose-500"
      />
      <div className="min-w-0 flex-1">
        <p className={`font-medium ${done ? "line-through" : ""}`}>{t.title}</p>
        <p className="flex flex-wrap items-center gap-2 pt-0.5 text-xs opacity-60">
          {t.dueAt && <span>{new Date(t.dueAt).toLocaleString()}</span>}
          {t.recurrence !== "none" && (
            <span className="rounded bg-black/5 px-1.5 py-0.5 dark:bg-white/10">
              {recurrenceLabel[t.recurrence]}
            </span>
          )}
          {t.createdBy && <span>· added by {t.createdBy.name}</span>}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        {!done && t.dueAt && (
          <Link
            href={`/todos/${t.id}/snooze`}
            className="text-xs underline opacity-60"
          >
            Reschedule
          </Link>
        )}
        <button
          onClick={() => onDelete(t.id)}
          className="text-xs opacity-40 hover:opacity-80"
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export function TodoList({
  todos,
  category,
  accentClass,
  onToggleDone,
  onDelete,
}: {
  todos: Todo[];
  category: Category;
  accentClass: string;
  onToggleDone: (id: string, done: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const inCategory = todos.filter((t) => t.category === category);
  const pending = inCategory
    .filter((t) => !t.done)
    .sort((a, b) => {
      if (!a.dueAt) return 1;
      if (!b.dueAt) return -1;
      return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
    });
  const done = inCategory.filter((t) => t.done);

  if (inCategory.length === 0) {
    return (
      <p className="p-8 text-center text-sm opacity-50">
        🌤️ Nothing here yet — add your first to-do above.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <ul className="flex flex-col gap-2">
        {pending.map((t) => (
          <TodoRow
            key={t.id}
            t={t}
            done={false}
            onToggleDone={onToggleDone}
            onDelete={onDelete}
            accentClass={accentClass}
          />
        ))}
      </ul>

      {done.length > 0 && (
        <details>
          <summary className="cursor-pointer px-1 text-sm opacity-60">
            Completed ({done.length})
          </summary>
          <ul className="mt-2 flex flex-col gap-2">
            {done.map((t) => (
              <TodoRow
                key={t.id}
                t={t}
                done={true}
                onToggleDone={onToggleDone}
                onDelete={onDelete}
                accentClass={accentClass}
              />
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
