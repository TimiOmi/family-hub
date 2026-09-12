export type Recurrence = "none" | "daily" | "weekly" | "monthly";

export function nextOccurrence(from: Date, recurrence: Recurrence): Date {
  const next = new Date(from);
  switch (recurrence) {
    case "daily":
      next.setDate(next.getDate() + 1);
      break;
    case "weekly":
      next.setDate(next.getDate() + 7);
      break;
    case "monthly":
      next.setMonth(next.getMonth() + 1);
      break;
    case "none":
      break;
  }
  return next;
}
