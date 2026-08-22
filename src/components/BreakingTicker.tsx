"use client";

import Link from "next/link";
import Marquee from "react-fast-marquee";

export default function BreakingTicker({
  items,
}: {
  items: { slug: string; title: string }[];
}) {
  if (!items.length) return null;
  return (
    <div className="flex items-center border-b bg-red-600 text-white">
      <span className="shrink-0 px-3 py-2 text-xs font-bold uppercase tracking-wide">Breaking</span>
      <Marquee pauseOnHover speed={50} className="flex-1 py-2 text-sm">
        {items.map((item) => (
          <Link key={item.slug} href={`/articles/${item.slug}`} className="mx-8 hover:underline">
            {item.title}
          </Link>
        ))}
      </Marquee>
    </div>
  );
}
