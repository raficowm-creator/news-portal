"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import TiptapEditor from "@/components/TiptapEditor";
import ImageUpload from "@/components/ImageUpload";

type Category = { id: string; name: string };

export default function ArticleForm({
  action,
  categories,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  categories: Category[];
  defaultValues?: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    imageUrl?: string | null;
    videoUrl?: string | null;
    categoryId: string;
    published: boolean;
    breaking?: boolean;
    featured?: boolean;
    tags?: string;
  };
  submitLabel: string;
}) {
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [excerpt, setExcerpt] = useState(defaultValues?.excerpt ?? "");
  const [content, setContent] = useState(defaultValues?.content ?? "");
  const [imageUrl, setImageUrl] = useState(defaultValues?.imageUrl ?? "");
  const [videoUrl, setVideoUrl] = useState(defaultValues?.videoUrl ?? "");
  const [tags, setTags] = useState(defaultValues?.tags ?? "");
  const [categoryId, setCategoryId] = useState(defaultValues?.categoryId || categories[0]?.id || "");
  const [published, setPublished] = useState(defaultValues?.published ?? false);
  const [breaking, setBreaking] = useState(defaultValues?.breaking ?? false);
  const [featured, setFeatured] = useState(defaultValues?.featured ?? false);
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }
    formData.set("categoryId", categoryId);
    formData.set("videoUrl", videoUrl);
    formData.set("tags", tags);
    setPending(true);
    try {
      await action(formData);
      toast.success("Article saved");
    } catch (err: any) {
      toast.error(err.message || "Could not save article");
      setPending(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!defaultValues) setSlug(slugify(e.target.value));
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" required pattern="[a-z0-9-]+" value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea id="excerpt" name="excerpt" required rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            <input type="hidden" name="content" value={content} />
            <TiptapEditor value={content} onChange={setContent} />
          </div>
          <div className="space-y-2">
            <Label>Cover image</Label>
            <input type="hidden" name="imageUrl" value={imageUrl} />
            <ImageUpload value={imageUrl} onChange={setImageUrl} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="videoUrl">YouTube video URL</Label>
            <Input id="videoUrl" name="videoUrl" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" name="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="politics, election, world" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <input type="hidden" name="categoryId" value={categoryId} />
            {categories.length === 0 ? (
              <p className="text-sm text-destructive">
                No categories yet. <Link href="/admin/categories/new" className="underline">Create a category</Link> first.
              </p>
            ) : (
              <select
                id="categoryId"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="flex items-center gap-3">
              <Switch checked={published} onCheckedChange={setPublished} />
              <input type="hidden" name="published" value={published ? "on" : ""} />
              <span className="text-sm">Published</span>
            </label>
            <label className="flex items-center gap-3">
              <Switch checked={breaking} onCheckedChange={setBreaking} />
              <input type="hidden" name="breaking" value={breaking ? "on" : ""} />
              <span className="text-sm">Breaking</span>
            </label>
            <label className="flex items-center gap-3">
              <Switch checked={featured} onCheckedChange={setFeatured} />
              <input type="hidden" name="featured" value={featured ? "on" : ""} />
              <span className="text-sm">Featured</span>
            </label>
          </div>
          <Button type="submit" disabled={pending || !categoryId}>
            {pending ? "Saving..." : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
