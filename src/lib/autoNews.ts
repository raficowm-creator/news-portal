import { prisma } from "@/lib/prisma";
import { getSettingsMap, upsertSetting } from "@/lib/settings";
import { revalidatePath } from "next/cache";

const WIRE = [
  {
    title: "Dhaka traffic eases after morning peak",
    excerpt: "Live desk: commute times dropped on several main corridors this hour.",
    content:
      "<p>City traffic monitors reported shorter queues after the morning rush.</p><p>Officials said signal timing changes on two arteries helped clear residual congestion.</p>",
    categorySlug: "world",
  },
  {
    title: "Markets tick higher in early trade",
    excerpt: "Regional indexes opened modestly up as traders watched currency moves.",
    content:
      "<p>Equity desks noted a cautious bid at the open.</p><p>Energy and banking names led the early tape while exporters stayed mixed.</p>",
    categorySlug: "business",
  },
  {
    title: "New app update rolls out to readers",
    excerpt: "The newsroom stack shipped a performance patch for article pages.",
    content:
      "<p>Page load times improved after a cache change on article routes.</p><p>Editors can still publish as usual from the admin desk.</p>",
    categorySlug: "tech",
  },
  {
    title: "Port cargo volume holds steady",
    excerpt: "Terminal operators reported no major delay in the last hour.",
    content:
      "<p>Container moves stayed near the weekly average.</p><p>Weather remains the main watch item for evening berths.</p>",
    categorySlug: "business",
  },
  {
    title: "Climate briefing: rain likely tonight",
    excerpt: "Meteorology desk flags scattered showers after sundown.",
    content:
      "<p>Cloud cover is building from the south.</p><p>Commuters should allow extra time on low-lying roads after dark.</p>",
    categorySlug: "world",
  },
  {
    title: "Chip supply talks continue",
    excerpt: "Industry sources say procurement meetings ran through the hour.",
    content:
      "<p>Buyers are still lining up Q4 allocations.</p><p>No formal statement has been issued yet.</p>",
    categorySlug: "tech",
  },
];

export async function isAutoNewsOn() {
  const settings = await getSettingsMap();
  return settings.auto_news !== "off";
}

export async function postLatestNews() {
  if (!(await isAutoNewsOn())) {
    return { ok: true, skipped: true, reason: "disabled" as const };
  }

  const recent = await prisma.article.findFirst({
    where: { slug: { startsWith: "auto-" } },
    orderBy: { createdAt: "desc" },
  });
  if (recent && Date.now() - recent.createdAt.getTime() < 50_000) {
    return { ok: true, skipped: true, reason: "rate_limit" as const, article: recent };
  }

  const settings = await getSettingsMap();
  const index = Number(settings.auto_news_index || "0") % WIRE.length;
  const wire = WIRE[index];

  const [author, category] = await Promise.all([
    prisma.user.findFirst({ where: { role: "ADMIN" }, orderBy: { createdAt: "asc" } }),
    prisma.category.findUnique({ where: { slug: wire.categorySlug } }).then(async (c) => {
      if (c) return c;
      return prisma.category.findFirst() ?? prisma.category.create({ data: { name: "World", slug: "world" } });
    }),
  ]);

  if (!author || !category) {
    return { ok: false, error: "Need an admin user and at least one category" };
  }

  const stamp = Date.now();
  const article = await prisma.article.create({
    data: {
      title: wire.title,
      slug: `auto-${stamp}`,
      excerpt: wire.excerpt,
      content: wire.content,
      imageUrl: `https://picsum.photos/seed/${stamp}/800/420`,
      published: true,
      breaking: index % 3 === 0,
      authorId: author.id,
      categoryId: category.id,
    },
    include: { category: true, author: { select: { name: true } } },
  });

  await upsertSetting("auto_news_index", String(index + 1));
  await upsertSetting("auto_news_last", new Date().toISOString());
  revalidatePath("/");
  revalidatePath("/admin/articles");

  return { ok: true, skipped: false, article };
}
