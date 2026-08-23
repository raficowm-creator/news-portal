import { prisma } from "@/lib/prisma";
import { getSettingsMap, upsertSetting } from "@/lib/settings";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

type WireStory = {
  title: string;
  excerpt: string;
  content: string;
  categorySlug: string;
  imageUrl?: string;
};

const FALLBACK: WireStory[] = [
  {
    title: "Live desk update: city traffic after morning peak",
    excerpt: "Main corridors are moving again after the rush hour crush.",
    content: "<p>Traffic monitors reported shorter queues on key arteries.</p>",
    categorySlug: "world",
  },
  {
    title: "Markets open mixed as traders watch the tape",
    excerpt: "Early trade stayed cautious across regional indexes.",
    content: "<p>Banking and energy names led a modest bid at the open.</p>",
    categorySlug: "business",
  },
  {
    title: "Tech briefing: devices, chips, and app updates",
    excerpt: "The hour’s technology notes from the newsroom wire.",
    content: "<p>Product and infrastructure notes landed on the desk this hour.</p>",
    categorySlug: "tech",
  },
];

function decode(text: string) {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseRss(xml: string, categorySlug: string): WireStory[] {
  const blocks: RegExpExecArray[] = [];
  const itemRegex = /<item\b[\s\S]*?<\/item>/gi;
  let match: RegExpExecArray | null;
  while ((match = itemRegex.exec(xml)) !== null) {
    blocks.push(match);
  }

  return blocks
    .map((m) => {
      const block = m[0];
      const title = decode((block.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "");
      const desc = decode(
        (block.match(/<description[^>]*>([\s\S]*?)<\/description>/i) || [])[1] ||
          (block.match(/<content:encoded[^>]*>([\s\S]*?)<\/content:encoded>/i) || [])[1] ||
          ""
      );
      const link = decode((block.match(/<link[^>]*>([\s\S]*?)<\/link>/i) || [])[1] || "");
      if (!title) return null;
      const excerpt = (desc || title).slice(0, 180);
      const content = `<p>${desc || title}</p>${link ? `<p>Source: <a href="${link}">${link}</a></p>` : ""}`;
      return { title: title.slice(0, 160), excerpt, content, categorySlug };
    })
    .filter((s): s is WireStory => Boolean(s));
}

async function fetchLiveStories(): Promise<WireStory[]> {
  const feeds = [
    { url: "https://feeds.bbci.co.uk/news/world/rss.xml", categorySlug: "world" },
    { url: "https://feeds.bbci.co.uk/news/technology/rss.xml", categorySlug: "tech" },
    { url: "https://feeds.bbci.co.uk/news/business/rss.xml", categorySlug: "business" },
  ];
  const out: WireStory[] = [];
  await Promise.all(
    feeds.map(async (feed) => {
      try {
        const res = await fetch(feed.url, { next: { revalidate: 60 }, headers: { "User-Agent": "NewsPortal/1.0" } });
        if (!res.ok) return;
        const xml = await res.text();
        out.push(...parseRss(xml, feed.categorySlug).slice(0, 8));
      } catch {
        /* use fallback */
      }
    })
  );
  return out.length ? out : FALLBACK;
}

async function ensureDesk() {
  let author =
    (await prisma.user.findFirst({ where: { role: "ADMIN" }, orderBy: { createdAt: "asc" } })) ||
    (await prisma.user.findFirst());
  if (!author) {
    author = await prisma.user.create({
      data: {
        name: "News Desk",
        email: "desk@newsportal.local",
        passwordHash: await bcrypt.hash("admin123", 10),
        role: "ADMIN",
      },
    });
  }
  const needed = [
    { name: "World", slug: "world" },
    { name: "Technology", slug: "tech" },
    { name: "Business", slug: "business" },
  ];
  for (const c of needed) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }
  return author;
}

export async function isAutoNewsOn() {
  const settings = await getSettingsMap();
  return settings.auto_news !== "off";
}

export async function postLatestNews() {
  try {
    if (!(await isAutoNewsOn())) {
      return { ok: true, skipped: true, reason: "disabled" as const };
    }

    const recent = await prisma.article.findFirst({
      where: { slug: { startsWith: "auto-" } },
      orderBy: { createdAt: "desc" },
    });
    if (recent && Date.now() - recent.createdAt.getTime() < 50_000) {
      return { ok: true, skipped: true, reason: "rate_limit" as const };
    }

    const author = await ensureDesk();
    const stories = await fetchLiveStories();
    const existingTitles = new Set(
      (
        await prisma.article.findMany({
          select: { title: true },
          orderBy: { createdAt: "desc" },
          take: 80,
        })
      ).map((a) => a.title.toLowerCase())
    );
    const wire = stories.find((s) => !existingTitles.has(s.title.toLowerCase())) || stories[0] || FALLBACK[0];
    const category =
      (await prisma.category.findUnique({ where: { slug: wire.categorySlug } })) ||
      (await prisma.category.findFirst());
    if (!category) {
      return { ok: false, error: "No category available" };
    }

    const stamp = Date.now();
    const article = await prisma.article.create({
      data: {
        title: wire.title,
        slug: `auto-${stamp}`,
        excerpt: wire.excerpt || wire.title,
        content: wire.content,
        imageUrl: `https://picsum.photos/seed/${stamp}/800/420`,
        published: true,
        breaking: true,
        authorId: author.id,
        categoryId: category.id,
      },
      include: { category: true, author: { select: { name: true } } },
    });

    await upsertSetting("auto_news_last", new Date().toISOString());
    revalidatePath("/");
    revalidatePath("/admin/articles");
    return { ok: true, skipped: false, article };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "auto-news failed" };
  }
}
