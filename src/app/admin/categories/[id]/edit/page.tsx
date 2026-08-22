import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateCategory } from "@/lib/actions/categoryActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const category = await prisma.category.findUnique({ where: { id: params.id } });
  if (!category) notFound();

  const updateCategoryWithId = updateCategory.bind(null, category.id);

  return (
    <div className="max-w-md">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">Edit Category</h1>
      <Card>
        <CardContent className="pt-6">
          <form action={updateCategoryWithId} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required defaultValue={category.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" required pattern="[a-z0-9-]+" defaultValue={category.slug} />
            </div>
            <Button type="submit">Update Category</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
