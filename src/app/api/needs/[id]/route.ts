import { prisma } from "@/lib/db";

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/needs/[id]">
) {
  const { id } = await ctx.params;
  await prisma.needItem.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
