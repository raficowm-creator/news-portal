import { prisma } from "@/lib/prisma";
import { createArticle } from "@/lib/actions/articleActions";
import ArticleForm from "@/components/ArticleForm";

export default async function NewArticlePage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">New Article</h1>
      <ArticleForm action={createArticle} categories={categories} submitLabel="Create Article" />
    </div>
  );
}
