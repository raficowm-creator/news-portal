import { NextResponse } from "next/server";
import { postLatestNews, isAutoNewsOn } from "@/lib/autoNews";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const enabled = await isAutoNewsOn();
  const latest = await prisma.article.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 9,
    include: { category: true, author: { select: { name: true } } },
  });
  return NextResponse.json({ enabled, articles: latest });
}

export async function POST() {
  const result = await postLatestNews();
  if (!result.ok) {
    return NextResponse.json(result, { status: 500 });
  }
  const latest = await prisma.article.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 9,
    include: { category: true, author: { select: { name: true } } },
  });
  return NextResponse.json({ ...result, articles: latest });
}
