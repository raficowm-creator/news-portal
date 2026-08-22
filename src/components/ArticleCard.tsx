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
    <article className={`overflow-hidden rounded-lg border bg-card shadow-sm transition hover:shadow-md ${large ? "md:flex" : ""}`}>
      {article.imageUrl && (
        <Link href={`/articles/${article.slug}`} className={large ? "md:w-1/2" : "block"}>
          <img
            src={article.imageUrl}
            alt={article.title}
            className={`w-full object-cover ${large ? "h-64 md:h-full" : "h-44"}`}
          />
        </Link>
      )}
      <div className="p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary">
            <Link href={`/category/${article.category.slug}`}>{article.category.name}</Link>
          </Badge>
          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
        </div>
        <Link href={`/articles/${article.slug}`}>
          <h2 className={`font-bold hover:text-primary ${large ? "text-2xl" : "text-lg"}`}>{article.title}</h2>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
        <p className="mt-3 text-xs text-muted-foreground">By {article.author.name}</p>
      </div>
    </article>
  );
}
