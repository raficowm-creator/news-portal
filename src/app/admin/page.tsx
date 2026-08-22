import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardCharts from "@/components/DashboardCharts";

export default async function AdminDashboard() {
  const [articleCount, categoryCount, userCount, publishedCount, categories] = await Promise.all([
    prisma.article.count(),
    prisma.category.count(),
    prisma.user.count(),
    prisma.article.count({ where: { published: true } }),
    prisma.category.findMany({
      include: { _count: { select: { articles: true } } },
    }),
  ]);

  const recentArticles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { category: true },
  });

  const byCategory = categories.map((c) => ({ name: c.name, count: c._count.articles }));
  const byStatus = [
    { name: "Published", value: publishedCount },
    { name: "Draft", value: articleCount - publishedCount },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold md:text-3xl">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Articles" value={articleCount} />
        <StatCard title="Categories" value={categoryCount} />
        <StatCard title="Users" value={userCount} />
      </div>

      <DashboardCharts byCategory={byCategory} byStatus={byStatus} />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent articles</CardTitle>
          <Button asChild variant="link">
            <Link href="/admin/articles">Manage all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {recentArticles.map((article) => (
              <li key={article.id} className="flex flex-col justify-between gap-1 sm:flex-row">
                <span className="font-medium">{article.title}</span>
                <span className="text-sm text-muted-foreground">{article.category.name}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
