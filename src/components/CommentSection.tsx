"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { addComment } from "@/lib/actions/homeActions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function CommentSection({
  articleId,
  loggedIn,
  comments,
}: {
  articleId: string;
  loggedIn: boolean;
  comments: { id: string; body: string; createdAt: Date | string; user: { name: string } }[];
}) {
  const [pending, setPending] = useState(false);

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-bold">Comments</h2>
      {loggedIn ? (
        <form
          className="mb-6 space-y-2"
          action={async (fd) => {
            setPending(true);
            const res = await addComment(articleId, fd);
            setPending(false);
            if (res.error) toast.error(res.error);
            else toast.success("Comment posted");
          }}
        >
          <Textarea name="body" required minLength={2} placeholder="Write a comment..." />
          <Button type="submit" disabled={pending}>
            {pending ? "Posting..." : "Post comment"}
          </Button>
        </form>
      ) : (
        <p className="mb-6 text-sm text-muted-foreground">
          <Link href="/login" className="text-primary underline">
            Login
          </Link>{" "}
          to comment.
        </p>
      )}
      <ul className="space-y-4">
        {comments.map((c) => (
          <li key={c.id} className="rounded-md border p-3">
            <p className="text-sm font-medium">{c.user.name}</p>
            <p className="text-sm text-muted-foreground">{new Date(c.createdAt).toLocaleString()}</p>
            <p className="mt-2 text-sm">{c.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
