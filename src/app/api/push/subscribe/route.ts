import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { personId, subscription } = body as {
    personId: string;
    subscription: { endpoint: string; keys: { p256dh: string; auth: string } };
  };

  if (!personId || !subscription?.endpoint) {
    return Response.json({ error: "personId and subscription are required" }, { status: 400 });
  }

  await prisma.pushSubscription.upsert({
    where: { endpoint: subscription.endpoint },
    create: {
      personId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
    update: {
      personId,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
  });

  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { endpoint } = body as { endpoint: string };
  if (!endpoint) {
    return Response.json({ error: "endpoint is required" }, { status: 400 });
  }
  await prisma.pushSubscription.deleteMany({ where: { endpoint } });
  return Response.json({ ok: true });
}
