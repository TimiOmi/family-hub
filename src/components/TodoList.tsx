"use client";

import Link from "next/link";
import type { Todo } from "@/lib/types";
import { CATEGORY_ORDER, CATEGORY_META } from "@/lib/categories";

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
}: {
  t: Todo;
  done: boolean;
  onToggleDone: (id: string, done: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const meta = CATEGORY_META[t.category];
  return (
    <li
      className={`flex items-center gap-3 rounded-xl border border-black/5 border-l-4 bg-white/70 p-3 shadow-sm transition dark:border-white/5 dark:bg-white/[0.03] ${
        done ? "opacity-50" : meta.accent
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
  onToggleDone,
  onDelete,
}: {
  todos: Todo[];
  onToggleDone: (id: string, done: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const pending = todos.filter((t) => !t.done);
  const done = todos.filter((t) => t.done);

  if (todos.length === 0) {
    return (
      <p className="p-8 text-center text-sm opacity-50">
        🌤️ Nothing here yet — add your first to-do above.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {CATEGORY_ORDER.map((category) => {
        const items = pending
          .filter((t) => t.category === category)
          .sort((a, b) => {
            if (!a.dueAt) return 1;
            if (!b.dueAt) return -1;
            return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
          });
        if (items.length === 0) return null;
        const meta = CATEGORY_META[category];
        return (
          <section key={category} className="flex flex-col gap-2">
            <h2 className="flex items-center gap-2 px-1 text-sm font-semibold opacity-70">
              <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
              {meta.emoji} {meta.label}
            </h2>
            <ul className="flex flex-col gap-2">
              {items.map((t) => (
                <TodoRow
                  key={t.id}
                  t={t}
                  done={false}
                  onToggleDone={onToggleDone}
                  onDelete={onDelete}
                />
              ))}
            </ul>
          </section>
        );
      })}

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
              />
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
