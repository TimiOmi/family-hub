import { prisma } from "@/lib/db";

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/todos/[id]/snooze">
) {
  const { id } = await ctx.params;
  const body = await request.json();
  const { dueAt } = body as { dueAt: string };

  if (!dueAt) {
    return Response.json({ error: "dueAt is required" }, { status: 400 });
  }

  const todo = await prisma.todo.update({
    where: { id },
    data: { dueAt: new Date(dueAt), lastNotifiedAt: null, done: false },
  });

  return Response.json(todo);
}
