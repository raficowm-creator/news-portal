"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const ArticleSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  imageUrl: z.string().url().optional().or(z.literal("")),
  categoryId: z.string().min(1),
  published: z.boolean().optional(),
});

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function createArticle(formData: FormData) {
  const session = await requireAdmin();

  const parsed = ArticleSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    imageUrl: formData.get("imageUrl") || "",
    categoryId: formData.get("categoryId"),
    published: formData.get("published") === "on",
  });

  if (!parsed.success) throw new Error("Invalid form data");

  const { title, slug, excerpt, content, imageUrl, categoryId, published } = parsed.data;

  await prisma.article.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      imageUrl: imageUrl || null,
      categoryId,
      published: published ?? false,
      authorId: session.user.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function updateArticle(id: string, formData: FormData) {
  await requireAdmin();

  const parsed = ArticleSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    imageUrl: formData.get("imageUrl") || "",
    categoryId: formData.get("categoryId"),
    published: formData.get("published") === "on",
  });

  if (!parsed.success) throw new Error("Invalid form data");

  const { title, slug, excerpt, content, imageUrl, categoryId, published } = parsed.data;

  await prisma.article.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt,
      content,
      imageUrl: imageUrl || null,
      categoryId,
      published: published ?? false,
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
