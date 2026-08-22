"use client";

import { deleteArticle } from "@/lib/actions/articleActions";
import { useTransition } from "react";
import toast from "react-hot-toast";

export default function DeleteArticleButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (!confirm("Delete this article?")) return;
        startTransition(async () => {
          try {
            await deleteArticle(id);
            toast.success("Article deleted");
          } catch {
            toast.error("Delete failed");
          }
        });
      }}
      disabled={pending}
      className="text-sm text-destructive hover:underline disabled:opacity-50"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
