import { prisma } from "@/lib/db";

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/todos/[id]">
) {
  const { id } = await ctx.params;
  const body = await request.json();
  const { title, notes, category, dueAt, recurrence, done } = body as {
    title?: string;
    notes?: string | null;
    category?: string;
    dueAt?: string | null;
    recurrence?: string;
    done?: boolean;
  };

  const todo = await prisma.todo.update({
    where: { id },
    data: {
      ...(title !== undefined ? { title: title.trim() } : {}),
      ...(notes !== undefined ? { notes: notes?.trim() || null } : {}),
      ...(category !== undefined
        ? { category: category as "spiritual" | "regular" | "work" }
        : {}),
      ...(dueAt !== undefined ? { dueAt: dueAt ? new Date(dueAt) : null } : {}),
      ...(recurrence !== undefined
        ? { recurrence: recurrence as "none" | "daily" | "weekly" | "monthly" }
        : {}),
      ...(done !== undefined ? { done } : {}),
    },
  });

  return Response.json(todo);
}

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/todos/[id]">
) {
  const { id } = await ctx.params;
  await prisma.todo.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
