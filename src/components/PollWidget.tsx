"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { votePoll } from "@/lib/actions/homeActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PollWidget({
  poll,
}: {
  poll: { id: string; question: string; options: { id: string; label: string; votes: number }[] };
}) {
  const total = poll.options.reduce((s, o) => s + o.votes, 0) || 1;
  const [voted, setVoted] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Poll</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm font-medium">{poll.question}</p>
        {poll.options.map((opt) => (
          <div key={opt.id}>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between"
              disabled={voted}
              onClick={async () => {
                const res = await votePoll(opt.id);
                if (res.error) toast.error(res.error);
                else {
                  toast.success("Vote counted");
                  setVoted(true);
                }
              }}
            >
              <span>{opt.label}</span>
              <span className="text-xs text-muted-foreground">{Math.round((opt.votes / total) * 100)}%</span>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
