export type Recurrence = "none" | "daily" | "weekly" | "monthly";
export type Category = "spiritual" | "regular" | "work";

export type Todo = {
  id: string;
  title: string;
  notes: string | null;
  category: Category;
  dueAt: string | null;
  recurrence: Recurrence;
  done: boolean;
  lastNotifiedAt: string | null;
  createdById: string | null;
  createdBy: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
};

export type GroceryItem = {
  id: string;
  name: string;
  needed: boolean;
  addedById: string | null;
  addedBy: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
};

export type NeedItem = {
  id: string;
  text: string;
  tags: string[];
  addedById: string | null;
  addedBy: { id: string; name: string } | null;
  createdAt: string;
};
