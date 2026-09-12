import { prisma } from "@/lib/db";
import { nextOccurrence } from "@/lib/recurrence";

export async function POST(
  _request: Request,
  ctx: RouteContext<"/api/todos/[id]/done">
) {
  const { id } = await ctx.params;
  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  if (todo.recurrence !== "none" && todo.dueAt) {
    const updated = await prisma.todo.update({
      where: { id },
      data: {
        dueAt: nextOccurrence(todo.dueAt, todo.recurrence),
        done: false,
        lastNotifiedAt: null,
      },
    });
    return Response.json(updated);
  }

  const updated = await prisma.todo.update({
    where: { id },
    data: { done: true },
  });
  return Response.json(updated);
}
