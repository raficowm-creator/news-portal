import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateArticle } from "@/lib/actions/articleActions";
import { ensureCategories } from "@/lib/ensureCategories";
import ArticleForm from "@/components/ArticleForm";

export default async function EditArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const article = await prisma.article.findUnique({ where: { id: params.id } });
  if (!article) notFound();

  const categories = await ensureCategories();
  const updateArticleWithId = updateArticle.bind(null, article.id);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">Edit Article</h1>
      <ArticleForm
        action={updateArticleWithId}
        categories={categories}
        submitLabel="Update Article"
        defaultValues={{
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          imageUrl: article.imageUrl,
          categoryId: article.categoryId,
          published: article.published,
        }}
      />
    </div>
  );
}
