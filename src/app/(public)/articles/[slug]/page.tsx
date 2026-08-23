import type { Metadata } from "next";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ReadingProgress from "@/components/ReadingProgress";
import ViewTracker from "@/components/ViewTracker";
import CommentSection from "@/components/CommentSection";
import ArticleCard from "@/components/ArticleCard";
import { youtubeEmbed } from "@/lib/youtube";

type ArticleParams = { slug: string };

const getArticle = cache(async (slug: string) => {
  return prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
      author: { select: { name: true } },
      tags: true,
      comments: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
      },
    },
  });
});

export async function generateMetadata({
  params,
}: {
  params: ArticleParams;
}): Promise<Metadata> {
  const article = await getArticle(params.slug);

  if (!article || !article.published) {
    return { title: "Article not found" };
  }

  const description = article.excerpt || `Read ${article.title} on News Portal.`;

  return {
    title: article.title,
    description,
    alternates: {
      canonical: `/articles/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description,
      type: "article",
      ...(article.imageUrl
        ? { images: [{ url: article.imageUrl, alt: article.title }] }
        : {}),
    },
    twitter: {
      card: article.imageUrl ? "summary_large_image" : "summary",
      title: article.title,
      description,
      ...(article.imageUrl ? { images: [article.imageUrl] } : {}),
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: ArticleParams;
}) {
  const session = await getServerSession(authOptions);
  const article = await getArticle(params.slug);

  if (!article || !article.published) notFound();

  const related = await prisma.article.findMany({
    where: {
      published: true,
      categoryId: article.categoryId,
      NOT: { id: article.id },
    },
    take: 3,
    include: { category: true, author: { select: { name: true } } },
  });

  const embed = youtubeEmbed(article.videoUrl);

  return (
    <>
      <ReadingProgress />
      <ViewTracker id={article.id} />
      <article className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-10">
        <Link
          href={`/category/${article.category.slug}`}
          className="text-sm font-semibold text-primary hover:underline"
        >
          {article.category.name}
        </Link>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          {article.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          By {article.author.name} •{" "}
          <time dateTime={new Date(article.createdAt).toISOString()}>
            {new Date(article.createdAt).toLocaleDateString()}
          </time>{" "}
          • {article.viewCount} views
        </p>
        {article.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2" aria-label="Article tags">
            {article.tags.map((t) => (
              <span key={t.id} className="rounded-full bg-muted px-3 py-1 text-xs">
                #{t.name}
              </span>
            ))}
          </div>
        )}
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.title}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="my-6 aspect-video w-full rounded-xl object-cover shadow-sm"
          />
        )}
        {embed && (
          <iframe
            src={embed}
            title={`Video: ${article.title}`}
            className="mb-6 aspect-video w-full rounded-xl"
            loading="lazy"
            allowFullScreen
          />
        )}
        <div
          className="prose mt-6 max-w-none leading-8 dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        <CommentSection articleId={article.id} loggedIn={!!session} comments={article.comments} />
      </article>
      {related.length > 0 && (
        <section
          className="mx-auto mt-12 max-w-5xl px-4 pb-10 sm:px-6"
          aria-labelledby="related-heading"
        >
          <h2 id="related-heading" className="mb-4 text-2xl font-bold tracking-tight">
            Related articles
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
