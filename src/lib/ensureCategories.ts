import { prisma } from "@/lib/prisma";

const DEFAULTS = [
  { name: "Technology", slug: "tech" },
  { name: "World", slug: "world" },
  { name: "Business", slug: "business" },
  { name: "Sports", slug: "sports" },
  { name: "Entertainment", slug: "entertainment" },
];

export async function ensureCategories() {
  const count = await prisma.category.count();
  if (count === 0) {
    await prisma.category.createMany({ data: DEFAULTS });
  }
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}
