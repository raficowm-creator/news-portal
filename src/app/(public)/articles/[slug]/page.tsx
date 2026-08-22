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

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await getServerSession(authOptions);
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
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
      <article className="mx-auto max-w-3xl">
        <Link href={`/category/${article.category.slug}`} className="text-primary hover:underline">
          {article.category.name}
        </Link>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">{article.title}</h1>
        <p className="mt-2 text-muted-foreground">
          By {article.author.name} • {new Date(article.createdAt).toLocaleDateString()} • {article.viewCount} views
        </p>
        {article.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {article.tags.map((t) => (
              <span key={t.id} className="rounded-full bg-muted px-2 py-0.5 text-xs">
                #{t.name}
              </span>
            ))}
          </div>
        )}
        {article.imageUrl && (
          <img src={article.imageUrl} alt={article.title} className="my-6 w-full rounded-lg" />
        )}
        {embed && (
          <iframe src={embed} title={article.title} className="mb-6 aspect-video w-full rounded-lg" allowFullScreen />
        )}
        <div className="prose mt-6 max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: article.content }} />
        <CommentSection articleId={article.id} loggedIn={!!session} comments={article.comments} />
      </article>
      {related.length > 0 && (
        <section className="mx-auto mt-12 max-w-5xl">
          <h2 className="mb-4 text-2xl font-bold">Related articles</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
