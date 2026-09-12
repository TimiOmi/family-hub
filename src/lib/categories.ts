import type { Category } from "@/lib/types";

export const CATEGORY_ORDER: Category[] = ["spiritual", "regular", "work"];

export const CATEGORY_META: Record<
  Category,
  { label: string; emoji: string; chip: string; dot: string; accent: string }
> = {
  spiritual: {
    label: "Spiritual",
    emoji: "🙏",
    chip: "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300",
    dot: "bg-violet-500",
    accent: "border-l-violet-400 dark:border-l-violet-500",
  },
  regular: {
    label: "Regular",
    emoji: "🏡",
    chip: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300",
    dot: "bg-sky-500",
    accent: "border-l-sky-400 dark:border-l-sky-500",
  },
  work: {
    label: "Work",
    emoji: "💼",
    chip: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
    dot: "bg-amber-500",
    accent: "border-l-amber-400 dark:border-l-amber-500",
  },
};
