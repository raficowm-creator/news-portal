"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function changeUserRole(formData: FormData) {
  await requireAdmin();

  const userId = formData.get("userId") as string;
  const role = formData.get("role") as "USER" | "ADMIN";

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/admin/users");
}
