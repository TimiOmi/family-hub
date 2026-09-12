"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Todo } from "@/lib/types";
import { CATEGORY_META } from "@/lib/categories";

export function DueBanner({
  todos,
  onDone,
}: {
  todos: Todo[];
  onDone: (id: string) => void;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(id);
  }, []);

  const due = todos.filter(
    (t) => !t.done && t.dueAt && new Date(t.dueAt).getTime() <= now
  );

  if (due.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 border-b border-amber-200/70 bg-amber-50/80 p-4 backdrop-blur dark:border-amber-500/20 dark:bg-amber-500/10">
      {due.map((t) => {
        const meta = CATEGORY_META[t.category];
        return (
          <div
            key={t.id}
            className="flex items-center justify-between gap-3 rounded-xl bg-white/90 p-3 shadow-sm dark:bg-black/50"
          >
            <div className="min-w-0">
              <p className="font-medium">
                {meta.emoji} {t.title}
              </p>
              <p className="text-xs opacity-60">
                Was due {new Date(t.dueAt!).toLocaleString()}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => onDone(t.id)}
                className="rounded-full bg-green-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 active:scale-95"
              >
                Doing it now
              </button>
              <Link
                href={`/todos/${t.id}/snooze`}
                className="rounded-full bg-rose-500 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-rose-600 active:scale-95"
              >
                Push it
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
