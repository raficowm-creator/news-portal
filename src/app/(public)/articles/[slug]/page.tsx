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
    <article className="max-w-3xl mx-auto">
      <Link
        href={`/category/${article.category.slug}`}
        className="text-blue-600 hover:underline"
      >
        {article.category.name}
      </Link>
      <h1 className="text-4xl font-bold mt-2">{article.title}</h1>
      <p className="text-gray-500 mt-2">
        By {article.author.name} •{" "}
        {new Date(article.createdAt).toLocaleDateString()}
      </p>
      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full my-6 rounded"
        />
      )}
      <div
        className="mt-6"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
}
