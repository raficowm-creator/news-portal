import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "all";
  const articles = await prisma.article.findMany({
    where: {
      published: true,
      ...(category !== "all" ? { category: { slug: category } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 8,
    include: {
      category: true,
      author: { select: { name: true } },
    },
  });
  return NextResponse.json({ articles });
}
