import { prisma } from "@/lib/db";

export async function GET() {
  const people = await prisma.person.findMany({ orderBy: { createdAt: "asc" } });
  return Response.json(people);
}
