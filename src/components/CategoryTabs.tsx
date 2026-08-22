"use client";

import { useState } from "react";
import ArticleCard from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";

export default function CategoryTabs({
  categories,
  initial,
}: {
  categories: { id: string; name: string; slug: string }[];
  initial: any[];
}) {
  const [slug, setSlug] = useState("all");
  const [items, setItems] = useState(initial);
  const [loading, setLoading] = useState(false);

  async function load(next: string) {
    setSlug(next);
    setLoading(true);
    const res = await fetch(`/api/articles?category=${next}`);
    const data = await res.json();
    setItems(data.articles || []);
    setLoading(false);
  }

  return (
    <section>
      <div className="mb-4 flex flex-wrap gap-2">
        <Button size="sm" variant={slug === "all" ? "default" : "outline"} onClick={() => load("all")}>
          All
        </Button>
        {categories.map((c) => (
          <Button key={c.id} size="sm" variant={slug === c.slug ? "default" : "outline"} onClick={() => load(c.slug)}>
            {c.name}
          </Button>
        ))}
      </div>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </section>
  );
}
