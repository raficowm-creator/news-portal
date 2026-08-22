"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function createCategory(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  await prisma.category.create({ data: { name, slug } });

  revalidatePath("/");
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  await prisma.category.update({
    where: { id },
    data: { name, slug },
  });

  revalidatePath("/");
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await prisma.category.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/categories");
}
