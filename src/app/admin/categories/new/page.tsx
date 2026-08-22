import { createCategory } from "@/lib/actions/categoryActions";

export default function NewCategoryPage() {
  return (
    <div className="max-w-md">
      <h1 className="text-3xl font-bold mb-6">New Category</h1>
      <form
        action={createCategory}
        className="space-y-4 bg-white p-6 rounded shadow"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            type="text"
            name="slug"
            required
            pattern="[a-z0-9-]+"
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Category
        </button>
      </form>
    </div>
  );
}
