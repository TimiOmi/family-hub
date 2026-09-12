"use client";

import { usePerson } from "@/lib/person-context";
import type { ReactNode } from "react";

const AVATAR_STYLES = [
  "bg-gradient-to-br from-rose-400 to-orange-300",
  "bg-gradient-to-br from-violet-400 to-sky-300",
];

export function IdentityGate({ children }: { children: ReactNode }) {
  const { people, personId, loading, choosePerson } = usePerson();

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm opacity-60">
        Loading…
      </div>
    );
  }

  if (!personId) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-8 p-6">
        <div className="text-center">
          <p className="text-3xl">🏡</p>
          <h1 className="mt-2 text-2xl font-semibold">Family Hub</h1>
          <p className="mt-1 text-sm opacity-60">Who&apos;s here?</p>
        </div>
        <div className="flex gap-4">
          {people.map((p, i) => (
            <button
              key={p.id}
              onClick={() => choosePerson(p.id)}
              className="flex flex-col items-center gap-2 rounded-2xl border border-black/5 bg-white/60 px-6 py-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md active:scale-95 dark:border-white/10 dark:bg-white/5"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-full text-xl font-semibold text-white shadow-inner ${
                  AVATAR_STYLES[i % AVATAR_STYLES.length]
                }`}
              >
                {p.name.charAt(0).toUpperCase()}
              </span>
              <span className="text-base font-medium">{p.name}</span>
            </button>
          ))}
        </div>
        <p className="max-w-xs text-center text-xs opacity-50">
          Saved on this device only, so we know who added or completed things.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
