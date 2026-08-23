"use client";

import { useEffect, useRef, useState } from "react";
import ArticleCard from "@/components/ArticleCard";

type CardArticle = {
  title: string;
  slug: string;
  excerpt: string;
  imageUrl?: string | null;
  createdAt: string | Date;
  category: { name: string; slug: string };
  author: { name: string };
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
  const [status, setStatus] = useState(enabled ? "Fetching latest…" : "Auto-post off");
  const [flash, setFlash] = useState<string | null>(null);
  const ran = useRef(false);

  async function pull() {
    try {
      const res = await fetch("/api/auto-news", { method: "POST", cache: "no-store" });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        setStatus(data.error || "Could not post — check database");
        setLive(false);
        return;
      }
      if (data.reason === "disabled") {
        setLive(false);
        setStatus("Auto-post off (enable in Admin → Settings)");
        return;
      }
      if (Array.isArray(data.articles) && data.articles.length) {
        setArticles(data.articles);
      }
      setLive(true);
      if (data.skipped) {
        setStatus("Live · next story soon");
      } else {
        const title = data.article?.title as string | undefined;
        setFlash(title || "New story posted");
        setStatus("New story posted");
      }
      setSeconds(60);
    } catch {
      setStatus("Network error — retrying");
    }
  }

  useEffect(() => {
    if (!enabled) return;
    if (!ran.current) {
      ran.current = true;
      void pull();
    }
    const tick = setInterval(() => setSeconds((s) => (s <= 1 ? 60 : s - 1)), 1000);
    const post = setInterval(() => void pull(), 60_000);
    return () => {
      clearInterval(tick);
      clearInterval(post);
    };
  }, [enabled]);

  return (
    <section>
      {flash ? (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
          Just in: {flash}
        </div>
      ) : null}
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
      {articles.length === 0 ? (
        <p className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
          No stories yet. Keep this page open — a headline will appear within a minute.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </section>
  );
}
