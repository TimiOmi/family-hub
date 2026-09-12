import { prisma } from "@/lib/db";
import type { Recurrence, Category } from "@/generated/prisma/enums";

export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: [{ dueAt: "asc" }, { createdAt: "asc" }],
    include: { createdBy: true },
  });
  return Response.json(todos);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, notes, category, dueAt, recurrence, createdById } = body as {
    title: string;
    notes?: string;
    category?: Category;
    dueAt?: string | null;
    recurrence?: Recurrence;
    createdById?: string;
  };

  if (!title || !title.trim()) {
    return Response.json({ error: "Title is required" }, { status: 400 });
  }

  const todo = await prisma.todo.create({
    data: {
      title: title.trim(),
      notes: notes?.trim() || null,
      category: category ?? "regular",
      dueAt: dueAt ? new Date(dueAt) : null,
      recurrence: recurrence ?? "none",
      createdById: createdById ?? null,
    },
  });

  return Response.json(todo, { status: 201 });
}
