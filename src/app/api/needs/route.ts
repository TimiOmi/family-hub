import { prisma } from "@/lib/db";

export async function GET() {
  const items = await prisma.needItem.findMany({
    orderBy: { createdAt: "desc" },
    include: { addedBy: true },
  });
  return Response.json(items);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { text, tags, addedById } = body as {
    text: string;
    tags?: string[];
    addedById?: string;
  };

  if (!text || !text.trim()) {
    return Response.json({ error: "Text is required" }, { status: 400 });
  }

  const item = await prisma.needItem.create({
    data: {
      text: text.trim(),
      tags: tags ?? [],
      addedById: addedById ?? null,
    },
  });

  return Response.json(item, { status: 201 });
}
