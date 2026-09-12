"use client";

import { NavBar } from "@/components/NavBar";
import { DueBanner } from "@/components/DueBanner";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";
import { PushSetup } from "@/components/PushSetup";
import { usePolling } from "@/lib/use-polling";
import type { Todo } from "@/lib/types";

export default function Home() {
  const { data: todos, refetch } = usePolling<Todo[]>("/api/todos");

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

  return (
    <>
      <NavBar />
      <DueBanner todos={todos ?? []} onDone={handleDone} />
      <div className="p-4">
        <PushSetup />
      </div>
      <TodoForm onCreated={refetch} />
      <TodoList
        todos={todos ?? []}
        onToggleDone={handleToggleDone}
        onDelete={handleDelete}
      />
    </>
  );
}
