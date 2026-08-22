"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { subscribeNewsletter } from "@/lib/actions/homeActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewsletterForm() {
  const [pending, setPending] = useState(false);

  return (
    <form
      className="flex flex-col gap-2 sm:flex-row"
      action={async (fd) => {
        setPending(true);
        const res = await subscribeNewsletter(fd);
        setPending(false);
        if (res.error) toast.error(res.error);
        else toast.success("Subscribed!");
      }}
    >
      <Input type="email" name="email" required placeholder="Your email" className="bg-background" />
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Subscribe"}
      </Button>
    </form>
  );
}
