import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteCategory } from "@/lib/actions/categoryActions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { articles: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">Categories</h1>
        <Button asChild>
          <Link href="/admin/categories/new">New Category</Link>
        </Button>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Articles</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell>{category._count.articles}</TableCell>
                <TableCell className="space-x-2">
                  <Link href={`/admin/categories/${category.id}/edit`} className="text-sm text-primary hover:underline">
                    Edit
                  </Link>
                  <form action={deleteCategory.bind(null, category.id)} className="inline">
                    <button
                      type="submit"
                      className="text-sm text-destructive hover:underline"
                      onClick={(e) => {
                        if (!confirm("Delete this category and all its articles?")) e.preventDefault();
                      }}
                    >
                      Delete
                    </button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
