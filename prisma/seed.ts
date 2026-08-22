import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin",
      passwordHash,
      role: "ADMIN",
    },
  });

  const tech = await prisma.category.upsert({
    where: { slug: "tech" },
    update: {},
    create: { name: "Technology", slug: "tech" },
  });

  const world = await prisma.category.upsert({
    where: { slug: "world" },
    update: {},
    create: { name: "World", slug: "world" },
  });

  const business = await prisma.category.upsert({
    where: { slug: "business" },
    update: {},
    create: { name: "Business", slug: "business" },
  });

  await prisma.article.create({
    data: {
      title: "Sample News Article",
      slug: "sample-news-article",
      excerpt: "This is a sample article to get you started.",
      content: "<p>This is the full content of the sample article. You can edit it in the admin panel.</p>",
      imageUrl: "https://picsum.photos/800/400",
      published: true,
      authorId: admin.id,
      categoryId: tech.id,
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
