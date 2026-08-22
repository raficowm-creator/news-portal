"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function incrementViews(articleId: string) {
  await prisma.article.update({
    where: { id: articleId },
    data: { viewCount: { increment: 1 } },
  });
}

export async function subscribeNewsletter(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email.includes("@")) return { error: "Invalid email" };
  try {
    await prisma.subscriber.create({ data: { email } });
    return { ok: true };
  } catch {
    return { error: "Already subscribed" };
  }
}

export async function votePoll(optionId: string) {
  const option = await prisma.pollOption.findUnique({
    where: { id: optionId },
    include: { poll: true },
  });
  if (!option) return { error: "Option not found" };
  const key = `poll_${option.pollId}`;
  if (cookies().get(key)?.value) return { error: "Already voted" };
  await prisma.pollOption.update({ where: { id: optionId }, data: { votes: { increment: 1 } } });
  cookies().set(key, "1", { maxAge: 60 * 60 * 24 * 365 });
  revalidatePath("/");
  return { ok: true };
}

export async function addComment(articleId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: "Login required" };
  const body = String(formData.get("body") || "").trim();
  if (body.length < 2) return { error: "Comment too short" };
  await prisma.comment.create({
    data: {
      body,
      articleId,
      userId: (session.user as any).id,
    },
  });
  revalidatePath(`/articles`);
  return { ok: true };
}
