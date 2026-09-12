import { prisma } from "@/lib/db";

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/groceries/[id]">
) {
  const { id } = await ctx.params;
  const body = await request.json();
  const { needed, name } = body as { needed?: boolean; name?: string };

  const item = await prisma.groceryItem.update({
    where: { id },
    data: {
      ...(needed !== undefined ? { needed } : {}),
      ...(name !== undefined ? { name: name.trim() } : {}),
    },
  });

  return Response.json(item);
}

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/groceries/[id]">
) {
  const { id } = await ctx.params;
  await prisma.groceryItem.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
