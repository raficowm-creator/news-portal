import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") || "";
  const articles = await prisma.article.findMany({
    where: {
      published: true,
      title: { contains: q, mode: "insensitive" },
    },
    take: 6,
    select: { slug: true, title: true },
  });
  return NextResponse.json({ articles });
}
