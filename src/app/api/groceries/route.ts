import { prisma } from "@/lib/db";

export async function GET() {
  const items = await prisma.groceryItem.findMany({
    orderBy: [{ needed: "desc" }, { createdAt: "asc" }],
    include: { addedBy: true },
  });
  return Response.json(items);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, addedById } = body as { name: string; addedById?: string };

  if (!name || !name.trim()) {
    return Response.json({ error: "Name is required" }, { status: 400 });
  }

  const item = await prisma.groceryItem.create({
    data: { name: name.trim(), addedById: addedById ?? null },
  });

  return Response.json(item, { status: 201 });
}
