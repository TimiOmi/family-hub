import { prisma } from "@/lib/db";
import { sendPushNotification } from "@/lib/push";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const dueTodos = await prisma.todo.findMany({
    where: { done: false, dueAt: { lte: now }, lastNotifiedAt: null },
  });

  if (dueTodos.length === 0) {
    return Response.json({ notified: 0 });
  }

  const subscriptions = await prisma.pushSubscription.findMany();
  const expiredIds: string[] = [];

  for (const todo of dueTodos) {
    for (const sub of subscriptions) {
      const result = await sendPushNotification(sub, {
        title: `Reminder: ${todo.title}`,
        body: todo.notes || "It's time. Doing it now, or push it to a new time?",
        todoId: todo.id,
        url: `/?todo=${todo.id}`,
      });
      if (!result.ok && result.expired) {
        expiredIds.push(sub.id);
      }
    }
    await prisma.todo.update({
      where: { id: todo.id },
      data: { lastNotifiedAt: now },
    });
  }

  if (expiredIds.length > 0) {
    await prisma.pushSubscription.deleteMany({ where: { id: { in: expiredIds } } });
  }

  return Response.json({ notified: dueTodos.length });
}
