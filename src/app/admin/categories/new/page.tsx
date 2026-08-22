import { createCategory } from "@/lib/actions/categoryActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewCategoryPage() {
  return (
    <div className="max-w-md">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">New Category</h1>
      <Card>
        <CardContent className="pt-6">
          <form action={createCategory} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" required pattern="[a-z0-9-]+" />
            </div>
            <Button type="submit">Create Category</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
