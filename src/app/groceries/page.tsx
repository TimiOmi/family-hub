"use client";

import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { usePerson } from "@/lib/person-context";
import { usePolling } from "@/lib/use-polling";
import type { GroceryItem } from "@/lib/types";

export default function GroceriesPage() {
  const { personId } = usePerson();
  const { data: items, refetch } = usePolling<GroceryItem[]>("/api/groceries");
  const [name, setName] = useState("");

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await fetch("/api/groceries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, addedById: personId }),
    });
    setName("");
    refetch();
  }

  async function toggleNeeded(item: GroceryItem) {
    await fetch(`/api/groceries/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ needed: !item.needed }),
    });
    refetch();
  }

  async function deleteItem(id: string) {
    await fetch(`/api/groceries/${id}`, { method: "DELETE" });
    refetch();
  }

  const list = items ?? [];
  const needed = list.filter((i) => i.needed);
  const bought = list.filter((i) => !i.needed);

  return (
    <>
      <NavBar />
      <form onSubmit={addItem} className="flex gap-2 p-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Milk, eggs, rice…"
          className="flex-1 rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200 dark:border-white/10 dark:bg-white/5 dark:focus:border-rose-500/50 dark:focus:ring-rose-500/20"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-rose-600 active:scale-[0.98] disabled:opacity-40"
        >
          Add
        </button>
      </form>

      <div className="flex flex-col gap-6 p-4 pt-0">
        {list.length === 0 && (
          <p className="p-8 text-center text-sm opacity-50">
            🧺 No items yet — add what you need to stock up on.
          </p>
        )}

        <ul className="flex flex-col gap-2">
          {needed.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-xl border-l-4 border-l-emerald-400 bg-white/70 p-3 shadow-sm dark:bg-white/[0.03]"
            >
              <input
                type="checkbox"
                checked={false}
                onChange={() => toggleNeeded(item)}
                className="h-5 w-5 shrink-0 accent-rose-500"
              />
              <span className="flex-1">{item.name}</span>
              <button
                onClick={() => deleteItem(item.id)}
                className="text-xs opacity-40 hover:opacity-80"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        {bought.length > 0 && (
          <details open>
            <summary className="cursor-pointer px-1 text-sm opacity-60">
              🛒 In the cart ({bought.length})
            </summary>
            <ul className="mt-2 flex flex-col gap-2">
              {bought.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl bg-white/40 p-3 opacity-50 dark:bg-white/[0.02]"
                >
                  <input
                    type="checkbox"
                    checked
                    onChange={() => toggleNeeded(item)}
                    className="h-5 w-5 shrink-0 accent-rose-500"
                  />
                  <span className="flex-1 line-through">{item.name}</span>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-xs opacity-40 hover:opacity-80"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </>
  );
}
