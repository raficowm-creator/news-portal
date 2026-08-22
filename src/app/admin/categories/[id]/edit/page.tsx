import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateCategory } from "@/lib/actions/categoryActions";

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const category = await prisma.category.findUnique({
    where: { id: params.id },
  });

  if (!category) notFound();

  const updateCategoryWithId = updateCategory.bind(null, category.id);

  return (
    <div className="max-w-md">
      <h1 className="text-3xl font-bold mb-6">Edit Category</h1>
      <form
        action={updateCategoryWithId}
        className="space-y-4 bg-white p-6 rounded shadow"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            defaultValue={category.name}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            type="text"
            name="slug"
            defaultValue={category.slug}
            required
            pattern="[a-z0-9-]+"
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Category
        </button>
      </form>
    </div>
  );
}
