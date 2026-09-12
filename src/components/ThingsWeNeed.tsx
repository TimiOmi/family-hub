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

function tagClass(tag: string, active: boolean) {
  const base = TAG_STYLES[tag] ?? "bg-rose-100 text-rose-800";
  return active
    ? base + " ring-2 ring-offset-1 ring-black/10 dark:ring-white/20"
    : "bg-black/5 text-black/50 hover:bg-black/10 dark:bg-white/5 dark:text-white/50";
}

function ItemRow({
  item,
  onToggleTag,
  onRemove,
}: {
  item: NeedItem;
  onToggleTag: (item: NeedItem, tag: string) => void;
  onRemove: (id: string) => void;
}) {
  const [editingTags, setEditingTags] = useState(false);

  return (
    <li className="flex flex-col gap-2 rounded-xl border-l-4 border-l-rose-300 bg-white/70 p-3 shadow-sm dark:bg-white/[0.03]">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-medium">{item.text}</p>
          {item.tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1.5">
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
            </div>
          )}
        </div>
        <button
          onClick={() => setEditingTags((v) => !v)}
          className="shrink-0 rounded-full bg-black/5 px-2 py-1 text-xs opacity-60 hover:opacity-100 dark:bg-white/10"
        >
          🏷️
        </button>
        <button
          onClick={() => onRemove(item.id)}
          className="shrink-0 text-xs opacity-40 hover:opacity-80"
        >
          Got it
        </button>
      </div>
      {editingTags && (
        <div className="flex flex-wrap gap-1.5 border-t border-black/5 pt-2 dark:border-white/5">
          {NEED_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => onToggleTag(item, tag)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${tagClass(
                tag,
                item.tags.includes(tag)
              )}`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </li>
  );
}

export function ThingsWeNeed() {
  const { personId } = usePerson();
  const { data: items, refetch } = usePolling<NeedItem[]>("/api/needs");
  const [text, setText] = useState("");
  const [filterTag, setFilterTag] = useState<string | null>(null);

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    const entries = text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (entries.length === 0) return;

    await Promise.all(
      entries.map((entry) =>
        fetch("/api/needs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: entry, tags: [], addedById: personId }),
        })
      )
    );
    setText("");
    refetch();
  }

  async function removeItem(id: string) {
    await fetch(`/api/needs/${id}`, { method: "DELETE" });
    refetch();
  }

  async function toggleTag(item: NeedItem, tag: string) {
    const tags = item.tags.includes(tag)
      ? item.tags.filter((t) => t !== tag)
      : [...item.tags, tag];
    await fetch(`/api/needs/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags }),
    });
    refetch();
  }

  const list = items ?? [];
  const visible = filterTag ? list.filter((i) => i.tags.includes(filterTag)) : list;

  return (
    <div className="flex flex-col gap-4 p-4">
      <form
        onSubmit={addItem}
        className="flex gap-2 rounded-2xl border border-black/10 bg-white/60 p-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.03]"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Almost out of… e.g. rice, detergent, toothpaste"
          className="flex-1 rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm shadow-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-200 dark:border-white/10 dark:bg-white/5"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="shrink-0 rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-rose-600 active:scale-[0.98] disabled:opacity-40"
        >
          Add
        </button>
      </form>
      <p className="px-1 text-xs opacity-50">
        Tap 🏷️ on an item afterward to tag it — tags don&apos;t need to be set right away.
      </p>

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
            All ({list.length})
          </button>
          {NEED_TAGS.map((tag) => {
            const count = list.filter((i) => i.tags.includes(tag)).length;
            if (count === 0) return null;
            return (
              <button
                key={tag}
                onClick={() => setFilterTag(tag === filterTag ? null : tag)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${tagClass(
                  tag,
                  filterTag === tag
                )}`}
              >
                {tag} ({count})
              </button>
            );
          })}
        </div>
      )}

      {visible.length === 0 && (
        <p className="p-8 text-center text-sm opacity-50">
          {filterTag
            ? `Nothing tagged "${filterTag}" right now.`
            : "📝 Nothing jotted down yet — add things here as you notice you're running low."}
        </p>
      )}

      <ul className="flex flex-col gap-2">
        {visible.map((item) => (
          <ItemRow key={item.id} item={item} onToggleTag={toggleTag} onRemove={removeItem} />
        ))}
      </ul>
    </div>
  );
}
