import { prisma } from "@/lib/prisma";
import ArticleCard from "@/components/ArticleCard";

export default async function HomePage() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      category: true,
      author: { select: { name: true } },
    },
  });

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div>
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Latest News</h1>
        <p className="text-gray-600">Stay updated with the latest stories.</p>
      </section>

      {featured && (
        <div className="mb-8">
          <ArticleCard article={featured} large />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rest.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
