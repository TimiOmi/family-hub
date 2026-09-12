import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const names = ["Timi", "Oyin"];
  for (const name of names) {
    const existing = await prisma.person.findFirst({ where: { name } });
    if (!existing) {
      await prisma.person.create({ data: { name } });
    }
  }
  const people = await prisma.person.findMany();
  console.log("People:", people);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
