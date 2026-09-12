"use client";

import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { DueBanner } from "@/components/DueBanner";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";
import { PushSetup } from "@/components/PushSetup";
import { usePolling } from "@/lib/use-polling";
import type { Category, Todo } from "@/lib/types";
import { CATEGORY_ORDER, CATEGORY_META } from "@/lib/categories";

export default function Home() {
  const { data: todos, refetch } = usePolling<Todo[]>("/api/todos");
  const [tab, setTab] = useState<Category>("regular");

  async function handleDone(id: string) {
    await fetch(`/api/todos/${id}/done`, { method: "POST" });
    refetch();
  }

  async function handleToggleDone(id: string, done: boolean) {
    if (done) {
      await handleDone(id);
    } else {
      await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: false }),
      });
      refetch();
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    refetch();
  }

  const list = todos ?? [];

  return (
    <>
      <NavBar />
      <DueBanner todos={list} onDone={handleDone} />
      <div className="p-4">
        <PushSetup />
      </div>

      <div className="flex gap-2 px-4">
        {CATEGORY_ORDER.map((c) => {
          const meta = CATEGORY_META[c];
          const count = list.filter((t) => t.category === c && !t.done).length;
          const active = tab === c;
          return (
            <button
              key={c}
              onClick={() => setTab(c)}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition ${
                active
                  ? meta.chip + " shadow-sm ring-2 ring-offset-1 ring-black/10 dark:ring-white/20"
                  : "bg-black/5 opacity-60 hover:opacity-100 dark:bg-white/5"
              }`}
            >
              {meta.emoji} {meta.label}
              {count > 0 && <span className="ml-1 opacity-60">({count})</span>}
            </button>
          );
        })}
      </div>

      <TodoForm key={tab} onCreated={refetch} defaultCategory={tab} />
      <TodoList
        todos={list}
        category={tab}
        accentClass={CATEGORY_META[tab].accent}
        onToggleDone={handleToggleDone}
        onDelete={handleDelete}
      />
    </>
  );
}
