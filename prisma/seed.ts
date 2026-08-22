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

  const ai = await prisma.tag.upsert({ where: { slug: "ai" }, update: {}, create: { name: "AI", slug: "ai" } });
  const markets = await prisma.tag.upsert({
    where: { slug: "markets" },
    update: {},
    create: { name: "Markets", slug: "markets" },
  });

  await prisma.article.upsert({
    where: { slug: "sample-news-article" },
    update: { breaking: true, featured: true, published: true },
    create: {
      title: "Sample News Article",
      slug: "sample-news-article",
      excerpt: "This is a sample article to get you started.",
      content: "<p>This is the full content of the sample article. You can edit it in the admin panel.</p>",
      imageUrl: "https://picsum.photos/800/400",
      published: true,
      breaking: true,
      featured: true,
      viewCount: 42,
      authorId: admin.id,
      categoryId: tech.id,
      tags: { connect: [{ id: ai.id }] },
    },
  });

  await prisma.article.upsert({
    where: { slug: "global-markets-open" },
    update: {},
    create: {
      title: "Global markets open higher",
      slug: "global-markets-open",
      excerpt: "Stocks climbed as investors weighed the latest economic data.",
      content: "<p>Markets opened higher across Asia and Europe.</p>",
      imageUrl: "https://picsum.photos/801/400",
      published: true,
      featured: true,
      viewCount: 18,
      authorId: admin.id,
      categoryId: business.id,
      tags: { connect: [{ id: markets.id }] },
    },
  });

  await prisma.article.upsert({
    where: { slug: "world-summit-talks" },
    update: {},
    create: {
      title: "World leaders meet for climate talks",
      slug: "world-summit-talks",
      excerpt: "Delegates gathered to discuss new climate commitments.",
      content: "<p>The summit opened with a call for faster action.</p>",
      imageUrl: "https://picsum.photos/802/400",
      published: true,
      breaking: true,
      viewCount: 27,
      authorId: admin.id,
      categoryId: world.id,
    },
  });

  const settings = {
    site_name: "NewsPortal",
    facebook: "https://facebook.com",
    twitter: "https://x.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    ad_header: "",
    ad_sidebar: "",
    ad_footer: "",
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({ where: { key }, update: {}, create: { key, value } });
  }

  const pollCount = await prisma.poll.count();
  if (pollCount === 0) {
    await prisma.poll.create({
      data: {
        question: "Which section do you read most?",
        active: true,
        options: {
          create: [{ label: "Technology" }, { label: "World" }, { label: "Business" }],
        },
      },
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
