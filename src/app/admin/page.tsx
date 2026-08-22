import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [articleCount, categoryCount, userCount] = await Promise.all([
    prisma.article.count(),
    prisma.category.count(),
    prisma.user.count(),
  ]);

  const recentArticles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { category: true },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg text-gray-500">Articles</h3>
          <p className="text-3xl font-bold">{articleCount}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg text-gray-500">Categories</h3>
          <p className="text-3xl font-bold">{categoryCount}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg text-gray-500">Users</h3>
          <p className="text-3xl font-bold">{userCount}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Recent Articles</h2>
        <ul className="space-y-2">
          {recentArticles.map((article) => (
            <li key={article.id} className="flex justify-between">
              <span>{article.title}</span>
              <span className="text-gray-500">{article.category.name}</span>
            </li>
          ))}
        </ul>
        <Link
          href="/admin/articles"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Manage all articles →
        </Link>
      </div>
    </div>
  );
}
