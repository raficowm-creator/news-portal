import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

async function createPoll(formData: FormData) {
  "use server";
  const question = String(formData.get("question") || "");
  const options = String(formData.get("options") || "")
    .split("\n")
    .map((o) => o.trim())
    .filter(Boolean);
  if (!question || options.length < 2) return;
  await prisma.poll.updateMany({ data: { active: false } });
  await prisma.poll.create({
    data: {
      question,
      active: true,
      options: { create: options.map((label) => ({ label })) },
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/polls");
}

export default async function PollsPage() {
  const polls = await prisma.poll.findMany({
    include: { options: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold md:text-3xl">Polls</h1>
      <Card>
        <CardContent className="pt-6">
          <form action={createPoll} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input id="question" name="question" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="options">Options (one per line)</Label>
              <textarea id="options" name="options" required rows={4} className="w-full rounded-md border border-input bg-background p-2 text-sm" />
            </div>
            <Button type="submit">Create active poll</Button>
          </form>
        </CardContent>
      </Card>
      {polls.map((p) => (
        <Card key={p.id}>
          <CardContent className="pt-6">
            <p className="font-medium">
              {p.question} {p.active ? "(active)" : ""}
            </p>
            <ul className="mt-2 text-sm text-muted-foreground">
              {p.options.map((o) => (
                <li key={o.id}>
                  {o.label}: {o.votes} votes
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
