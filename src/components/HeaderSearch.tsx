"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function HeaderSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<{ slug: string; title: string }[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (q.trim().length < 2) {
      setHits([]);
      return;
    }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setHits(data.articles || []);
      setOpen(true);
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <form
      className="relative w-full max-w-xs"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/search?q=${encodeURIComponent(q)}`);
        setOpen(false);
      }}
    >
      <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search news..."
        className="h-9 bg-background pl-8 text-foreground"
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onFocus={() => hits.length && setOpen(true)}
      />
      {open && hits.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-popover text-sm shadow">
          {hits.map((h) => (
            <li key={h.slug}>
              <Link href={`/articles/${h.slug}`} className="block px-3 py-2 hover:bg-accent">
                {h.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
