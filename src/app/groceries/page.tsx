"use client";

import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { ThingsWeNeed } from "@/components/ThingsWeNeed";
import { ShoppingList } from "@/components/ShoppingList";

const TABS = [
  { id: "needs", label: "📝 Things We Need" },
  { id: "shopping", label: "🛒 Shopping List" },
] as const;

export default function GroceriesPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("needs");

  return (
    <>
      <NavBar />
      <div className="flex gap-2 p-4 pb-0">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition ${
              tab === t.id
                ? "bg-rose-500 text-white shadow-sm"
                : "bg-black/5 opacity-60 hover:opacity-100 dark:bg-white/5"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "needs" ? <ThingsWeNeed /> : <ShoppingList />}
    </>
  );
}
