"use client";

import { deleteArticle } from "@/lib/actions/articleActions";
import { useTransition } from "react";

export default function DeleteArticleButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (confirm("Are you sure you want to delete this article?")) {
          startTransition(() => deleteArticle(id));
        }
      }}
      disabled={pending}
      className="text-red-600 hover:underline disabled:opacity-50"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
