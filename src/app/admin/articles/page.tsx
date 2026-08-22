import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import DeleteArticleButton from "@/components/DeleteArticleButton";

const PAGE_SIZE = 10;

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string; status?: string };
}) {
  const q = searchParams.q || "";
  const page = Math.max(1, Number(searchParams.page) || 1);
  const status = searchParams.status || "all";

  const where = {
    AND: [
      q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" as const } },
              { slug: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {},
      status === "published" ? { published: true } : status === "draft" ? { published: false } : {},
    ],
  };

  const [total, articles] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        category: true,
        author: { select: { name: true } },
      },
    }),
  ]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">Articles</h1>
        <Button asChild>
          <Link href="/admin/articles/new">New Article</Link>
        </Button>
      </div>

      <form className="flex flex-col gap-2 sm:flex-row">
        <Input name="q" defaultValue={q} placeholder="Search title or slug..." className="sm:max-w-xs" />
        <select
          name="status"
          defaultValue={status}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <Button type="submit" variant="secondary">
          Filter
        </Button>
      </form>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden lg:table-cell">Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium">{article.title}</TableCell>
                <TableCell className="hidden md:table-cell">{article.category.name}</TableCell>
                <TableCell className="hidden lg:table-cell">{article.author.name}</TableCell>
                <TableCell>
                  <Badge variant={article.published ? "success" : "warning"}>
                    {article.published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="space-x-2 whitespace-nowrap">
                  <Link href={`/admin/articles/${article.id}/edit`} className="text-sm text-primary hover:underline">
                    Edit
                  </Link>
                  <DeleteArticleButton id={article.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {total} results · page {page} of {pages}
        </span>
        <div className="flex gap-2">
          {page > 1 && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/articles?q=${encodeURIComponent(q)}&status=${status}&page=${page - 1}`}>
                Previous
              </Link>
            </Button>
          )}
          {page < pages && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/articles?q=${encodeURIComponent(q)}&status=${status}&page=${page + 1}`}>
                Next
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
