import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      author: { select: { name: true } },
    },
  });

  if (!article || !article.published) notFound();

  return (
    <article className="mx-auto max-w-3xl">
      <Link href={`/category/${article.category.slug}`} className="text-primary hover:underline">
        {article.category.name}
      </Link>
      <h1 className="mt-2 text-3xl font-bold md:text-4xl">{article.title}</h1>
      <p className="mt-2 text-muted-foreground">
        By {article.author.name} • {new Date(article.createdAt).toLocaleDateString()}
      </p>
      {article.imageUrl && (
        <img src={article.imageUrl} alt={article.title} className="my-6 w-full rounded-lg" />
      )}
      <div className="prose mt-6 max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: article.content }} />
    </article>
  );
}
