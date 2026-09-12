"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SnoozePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [title, setTitle] = useState<string | null>(null);
  const [date, setDate] = useState(() =>
    new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [time, setTime] = useState(() =>
    new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(11, 16)
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/todos")
      .then((res) => res.json())
      .then((todos: { id: string; title: string }[]) => {
        const todo = todos.find((t) => t.id === id);
        setTitle(todo?.title ?? "This to-do");
      });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !time) return;
    setSaving(true);
    const dueAt = new Date(`${date}T${time}`).toISOString();
    await fetch(`/api/todos/${id}/snooze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dueAt }),
    });
    router.push("/");
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 p-6">
      <div className="text-center">
        <p className="text-2xl">⏰</p>
        <h1 className="mt-2 text-lg font-semibold">
          Push &ldquo;{title ?? "…"}&rdquo; to when?
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-xs flex-col gap-3 rounded-2xl border border-black/10 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.03]"
      >
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-200 dark:border-white/10 dark:bg-white/5"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-200 dark:border-white/10 dark:bg-white/5"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-rose-600 active:scale-[0.98] disabled:opacity-40"
        >
          Remind me then
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-sm opacity-60"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
