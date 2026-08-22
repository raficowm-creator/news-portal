import { prisma } from "@/lib/prisma";
import { getSettingsMap } from "@/lib/settings";
import ArticleCard from "@/components/ArticleCard";
import FeaturedSlider from "@/components/FeaturedSlider";
import CategoryTabs from "@/components/CategoryTabs";
import WeatherWidget from "@/components/WeatherWidget";
import PollWidget from "@/components/PollWidget";
import Link from "next/link";
import { youtubeEmbed } from "@/lib/youtube";

export default async function HomePage() {
  const [featured, latest, trending, categories, tags, poll, videos, settings] = await Promise.all([
    prisma.article.findMany({
      where: { published: true, featured: true },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { category: true, author: { select: { name: true } } },
    }),
    prisma.article.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 9,
      include: { category: true, author: { select: { name: true } } },
    }),
    prisma.article.findMany({
      where: { published: true },
      orderBy: { viewCount: "desc" },
      take: 6,
      select: { slug: true, title: true, viewCount: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({
      include: { _count: { select: { articles: true } } },
      orderBy: { articles: { _count: "desc" } },
      take: 12,
    }),
    prisma.poll.findFirst({
      where: { active: true },
      include: { options: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.article.findMany({
      where: { published: true, NOT: { videoUrl: null } },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    getSettingsMap(),
  ]);

  const slider = featured.length ? featured : latest.slice(0, 3);
  const dontMiss = trending.slice(0, 4);

  return (
    <div className="space-y-10">
      <FeaturedSlider slides={slider} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <h2 className="mb-4 text-2xl font-bold">Latest news</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {latest.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">By category</h2>
            <CategoryTabs categories={categories} initial={latest.slice(0, 6)} />
          </section>

          {videos.length > 0 && (
            <section>
              <h2 className="mb-4 text-2xl font-bold">Video news</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {videos.map((v) => {
                  const embed = youtubeEmbed(v.videoUrl);
                  return (
                    <div key={v.id} className="overflow-hidden rounded-lg border">
                      {embed && (
                        <iframe
                          src={embed}
                          title={v.title}
                          className="aspect-video w-full"
                          allowFullScreen
                        />
                      )}
                      <Link href={`/articles/${v.slug}`} className="block p-3 font-medium hover:text-primary">
                        {v.title}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <WeatherWidget />
          <div className="rounded-lg border p-4">
            <h3 className="mb-3 font-semibold">Trending</h3>
            <ol className="space-y-3 text-sm">
              {trending.map((a, i) => (
                <li key={a.slug} className="flex gap-2">
                  <span className="font-bold text-muted-foreground">{i + 1}.</span>
                  <Link href={`/articles/${a.slug}`} className="hover:text-primary">
                    {a.title}
                    <span className="ml-1 text-xs text-muted-foreground">({a.viewCount})</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
          {poll && <PollWidget poll={poll} />}
          <div className="rounded-lg border p-4">
            <h3 className="mb-3 font-semibold">Popular tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <Link
                  key={t.id}
                  href={`/search?q=${encodeURIComponent(t.name)}`}
                  className="rounded-full bg-muted px-3 py-1 text-xs hover:bg-accent"
                >
                  #{t.name}
                </Link>
              ))}
            </div>
          </div>
          {settings.ad_sidebar ? (
            <div className="rounded-lg border p-3" dangerouslySetInnerHTML={{ __html: settings.ad_sidebar }} />
          ) : (
            <div className="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground">
              Ad slot (set in Admin → Settings)
            </div>
          )}
          <div className="rounded-lg border p-4">
            <h3 className="mb-3 font-semibold">Don't miss</h3>
            <ul className="space-y-2 text-sm">
              {dontMiss.map((a) => (
                <li key={a.slug}>
                  <Link href={`/articles/${a.slug}`} className="hover:text-primary">
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
