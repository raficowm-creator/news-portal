import Link from "next/link";
import type { Article, Category, User } from "@prisma/client";

type ArticleWithRelations = Article & {
  category: Category;
  author: Pick<User, "name">;
};

export default function ArticleCard({
  article,
  large = false,
}: {
  article: ArticleWithRelations;
  large?: boolean;
}) {
  return (
    <div
      className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition ${
        large ? "md:flex" : ""
      }`}
    >
      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className={`w-full object-cover ${
            large ? "md:w-1/2 h-64 md:h-auto" : "h-40"
          }`}
        />
      )}
      <div className="p-4">
        <Link href={`/articles/${article.slug}`} className="block">
          <h2
            className={`font-bold hover:text-blue-600 ${
              large ? "text-2xl" : "text-xl"
            }`}
          >
            {article.title}
          </h2>
        </Link>
        <p className="text-gray-600 mt-2">{article.excerpt}</p>
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <Link
            href={`/category/${article.category.slug}`}
            className="text-blue-600 hover:underline"
          >
            {article.category.name}
          </Link>
          <span>{article.author.name}</span>
        </div>
      </div>
    </div>
  );
}
