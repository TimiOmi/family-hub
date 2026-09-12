import { prisma } from "@/lib/db";

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/needs/[id]">
) {
  const { id } = await ctx.params;
  const body = await request.json();
  const { tags } = body as { tags: string[] };

  const item = await prisma.needItem.update({
    where: { id },
    data: { tags },
  });

  return Response.json(item);
}

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/needs/[id]">
) {
  const { id } = await ctx.params;
  await prisma.needItem.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
