import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateArticle } from "@/lib/actions/articleActions";

export default async function EditArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const article = await prisma.article.findUnique({
    where: { id: params.id },
  });

  if (!article) notFound();

  const categories = await prisma.category.findMany();
  const updateArticleWithId = updateArticle.bind(null, article.id);

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Edit Article</h1>
      <form
        action={updateArticleWithId}
        className="space-y-4 bg-white p-6 rounded shadow"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            defaultValue={article.title}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            type="text"
            name="slug"
            defaultValue={article.slug}
            required
            pattern="[a-z0-9-]+"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Excerpt</label>
          <textarea
            name="excerpt"
            defaultValue={article.excerpt}
            required
            rows={3}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Content (HTML)
          </label>
          <textarea
            name="content"
            defaultValue={article.content}
            required
            rows={8}
            className="w-full border p-2 rounded font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            type="url"
            name="imageUrl"
            defaultValue={article.imageUrl || ""}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="categoryId"
            defaultValue={article.categoryId}
            required
            className="w-full border p-2 rounded"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="published"
            defaultChecked={article.published}
          />
          <span>Published</span>
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Article
        </button>
      </form>
    </div>
  );
}
