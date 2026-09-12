"use client";

import { useState } from "react";
import { usePerson } from "@/lib/person-context";
import { usePolling } from "@/lib/use-polling";
import type { NeedItem } from "@/lib/types";
import { NEED_TAGS } from "@/lib/tags";

const TAG_STYLES: Record<string, string> = {
  Ireoluwa: "bg-pink-100 text-pink-800 dark:bg-pink-500/15 dark:text-pink-300",
  kitchen: "bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300",
  Timi: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300",
  Oyin: "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300",
  washing: "bg-teal-100 text-teal-800 dark:bg-teal-500/15 dark:text-teal-300",
};

export function ThingsWeNeed() {
  const { personId } = usePerson();
  const { data: items, refetch } = usePolling<NeedItem[]>("/api/needs");
  const [text, setText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filterTag, setFilterTag] = useState<string | null>(null);

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    await fetch("/api/needs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, tags: selectedTags, addedById: personId }),
    });
    setText("");
    setSelectedTags([]);
    refetch();
  }

  async function removeItem(id: string) {
    await fetch(`/api/needs/${id}`, { method: "DELETE" });
    refetch();
  }

  function toggleSelectedTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  const list = items ?? [];
  const visible = filterTag ? list.filter((i) => i.tags.includes(filterTag)) : list;

  return (
    <div className="flex flex-col gap-4 p-4">
      <form
        onSubmit={addItem}
        className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white/60 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.03]"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Almost out of… (rice, detergent, toothpaste)"
          className="rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-200 dark:border-white/10 dark:bg-white/5"
        />
        <div className="flex flex-wrap gap-2">
          {NEED_TAGS.map((tag) => {
            const selected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleSelectedTag(tag)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  selected
                    ? (TAG_STYLES[tag] ?? "bg-rose-100 text-rose-800") +
                      " ring-2 ring-offset-1 ring-black/10 dark:ring-white/20"
                    : "bg-black/5 text-black/50 hover:bg-black/10 dark:bg-white/5 dark:text-white/50"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
        <button
          type="submit"
          disabled={!text.trim()}
          className="self-end rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-rose-600 active:scale-[0.98] disabled:opacity-40"
        >
          Add to the list
        </button>
      </form>

      {list.length > 0 && (
        <div className="flex flex-wrap gap-2 px-1">
          <button
            onClick={() => setFilterTag(null)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              filterTag === null
                ? "bg-black/80 text-white dark:bg-white dark:text-black"
                : "bg-black/5 text-black/50 dark:bg-white/5 dark:text-white/50"
            }`}
          >
            All
          </button>
          {NEED_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag === filterTag ? null : tag)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                filterTag === tag
                  ? (TAG_STYLES[tag] ?? "bg-rose-100 text-rose-800") +
                    " ring-2 ring-offset-1 ring-black/10 dark:ring-white/20"
                  : "bg-black/5 text-black/50 hover:bg-black/10 dark:bg-white/5 dark:text-white/50"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 && (
        <p className="p-8 text-center text-sm opacity-50">
          📝 Nothing jotted down yet — add things here as you notice you&apos;re running low.
        </p>
      )}

      <ul className="flex flex-col gap-2">
        {visible.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 rounded-xl border-l-4 border-l-rose-300 bg-white/70 p-3 shadow-sm dark:bg-white/[0.03]"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium">{item.text}</p>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      TAG_STYLES[tag] ?? "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
                {item.addedBy && (
                  <span className="text-[11px] opacity-50">· jotted by {item.addedBy.name}</span>
                )}
              </div>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="shrink-0 text-xs opacity-40 hover:opacity-80"
            >
              Got it
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
