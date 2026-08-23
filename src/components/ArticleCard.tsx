import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function ArticleCard({
  article,
  large = false,
}: {
  article: {
    title: string;
    slug: string;
    excerpt: string;
    imageUrl?: string | null;
    createdAt: string | Date;
    category: { name: string; slug: string };
    author: { name: string };
  };
  large?: boolean;
}) {
  return (
    <article
      className={`group overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        large ? "md:flex" : ""
      }`}
    >
      {article.imageUrl && (
        <Link
          href={`/articles/${article.slug}`}
          aria-label={`Read ${article.title}`}
          className={`block overflow-hidden ${large ? "md:w-1/2" : ""}`}
        >
          <img
            src={article.imageUrl}
            alt={article.title}
            loading={large ? "eager" : "lazy"}
            decoding="async"
            className={`w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] ${
              large ? "h-64 md:h-full" : "h-44"
            }`}
          />
        </Link>
      )}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary" className="font-medium">
            <Link href={`/category/${article.category.slug}`}>
              {article.category.name}
            </Link>
          </Badge>
          <time dateTime={new Date(article.createdAt).toISOString()}>
            {new Date(article.createdAt).toLocaleDateString()}
          </time>
        </div>
        <Link href={`/articles/${article.slug}`} className="block">
          <h2
            className={`font-bold leading-tight transition-colors group-hover:text-primary ${
              large ? "text-2xl" : "text-lg"
            }`}
          >
            {article.title}
          </h2>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {article.excerpt}
        </p>
        <p className="mt-auto pt-3 text-xs text-muted-foreground">
          By {article.author.name}
        </p>
      </div>
    </article>
  );
}
