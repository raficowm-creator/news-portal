"use client";

import { useEffect, useState } from "react";
import ArticleCard from "@/components/ArticleCard";

type CardArticle = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl?: string | null;
  createdAt: string | Date;
  category: { name: string; slug: string };
  author: { name: true | string } | { name: string };
};

export default function AutoNewsFeed({
  initial,
  enabled = true,
}: {
  initial: CardArticle[];
  enabled?: boolean;
}) {
  const [articles, setArticles] = useState(initial);
  const [seconds, setSeconds] = useState(60);
  const [live, setLive] = useState(enabled);
  const [status, setStatus] = useState(enabled ? "Live desk on" : "Auto-post off");

  useEffect(() => {
    if (!enabled) return;

    const tick = setInterval(() => {
      setSeconds((s) => (s <= 1 ? 60 : s - 1));
    }, 1000);

    const post = setInterval(async () => {
      try {
        const res = await fetch("/api/auto-news", { method: "POST" });
        const data = await res.json();
        if (data.enabled === false) {
          setLive(false);
          setStatus("Auto-post off");
          return;
        }
        if (Array.isArray(data.articles)) setArticles(data.articles);
        setLive(true);
        setStatus(data.skipped ? "Waiting for next slot" : "New story posted");
        setSeconds(60);
      } catch {
        setStatus("Retrying");
      }
    }, 60_000);

    return () => {
      clearInterval(tick);
      clearInterval(post);
    };
  }, [enabled]);

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-bold">Latest news</h2>
        <p className="text-xs text-muted-foreground">
          {live ? (
            <span className="mr-2 inline-flex items-center gap-1 font-medium text-red-600">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-600" />
              LIVE
            </span>
          ) : null}
          {status}
          {live ? ` · next in ${seconds}s` : null}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article as any} />
        ))}
      </div>
    </section>
  );
}
