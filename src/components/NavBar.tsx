"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePerson } from "@/lib/person-context";

export function NavBar() {
  const pathname = usePathname();
  const { person, switchPerson } = usePerson();

  const tabClass = (href: string) =>
    `rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
      pathname === href
        ? "bg-rose-500 text-white shadow-sm"
        : "text-current opacity-60 hover:opacity-100"
    }`;

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 bg-white/70 px-4 py-3 backdrop-blur-md dark:border-white/5 dark:bg-black/40">
      <div className="flex items-center gap-3">
        <span className="text-lg">🏡</span>
        <nav className="flex gap-1.5">
          <Link href="/" className={tabClass("/")}>
            To-dos
          </Link>
          <Link href="/groceries" className={tabClass("/groceries")}>
            Groceries
          </Link>
        </nav>
      </div>
      <button
        onClick={switchPerson}
        className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium opacity-70 dark:bg-white/10"
      >
        {person?.name ?? "Switch"}
      </button>
    </header>
  );
}
