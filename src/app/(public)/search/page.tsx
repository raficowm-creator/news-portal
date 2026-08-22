import { prisma } from "@/lib/prisma";
import ArticleCard from "@/components/ArticleCard";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q || "";
  const articles = await prisma.article.findMany({
    where: {
      published: true,
      OR: [
        { title: { contains: q } },
        { excerpt: { contains: q } },
        { content: { contains: q } },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      author: { select: { name: true } },
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Search Results for "{q}"</h1>
      <form className="mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search..."
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="ml-2 bg-blue-600 text-white p-2 rounded"
        >
          Search
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
