"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { slugify } from "@/lib/utils";

const ArticleSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  imageUrl: z.string().optional().or(z.literal("")),
  videoUrl: z.string().optional().or(z.literal("")),
  categoryId: z.string().min(1),
  published: z.boolean().optional(),
  breaking: z.boolean().optional(),
  featured: z.boolean().optional(),
  tags: z.string().optional(),
});

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

async function connectTags(raw?: string) {
  const names = (raw || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const tags = [];
  for (const name of names) {
    const slug = slugify(name);
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });
    tags.push({ id: tag.id });
  }
  return tags;
}

function parseArticle(formData: FormData) {
  return ArticleSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    imageUrl: formData.get("imageUrl") || "",
    videoUrl: formData.get("videoUrl") || "",
    categoryId: formData.get("categoryId"),
    published: formData.get("published") === "on",
    breaking: formData.get("breaking") === "on",
    featured: formData.get("featured") === "on",
    tags: formData.get("tags") || "",
  });
}

export async function createArticle(formData: FormData) {
  const session = await requireAdmin();
  const parsed = parseArticle(formData);
  if (!parsed.success) throw new Error("Invalid form data");
  const d = parsed.data;
  const tags = await connectTags(d.tags);
  await prisma.article.create({
    data: {
      title: d.title,
      slug: d.slug,
      excerpt: d.excerpt,
      content: d.content,
      imageUrl: d.imageUrl || null,
      videoUrl: d.videoUrl || null,
      categoryId: d.categoryId,
      published: d.published ?? false,
      breaking: d.breaking ?? false,
      featured: d.featured ?? false,
      authorId: session.user.id,
      tags: { connect: tags },
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function updateArticle(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = parseArticle(formData);
  if (!parsed.success) throw new Error("Invalid form data");
  const d = parsed.data;
  const tags = await connectTags(d.tags);
  await prisma.article.update({
    where: { id },
    data: {
      title: d.title,
      slug: d.slug,
      excerpt: d.excerpt,
      content: d.content,
      imageUrl: d.imageUrl || null,
      videoUrl: d.videoUrl || null,
      categoryId: d.categoryId,
      published: d.published ?? false,
      breaking: d.breaking ?? false,
      featured: d.featured ?? false,
      tags: { set: tags },
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function deleteArticle(id: string) {
  await requireAdmin();
  await prisma.article.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/articles");
}
