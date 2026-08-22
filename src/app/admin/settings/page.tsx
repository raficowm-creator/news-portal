import { getSettingsMap, upsertSetting } from "@/lib/settings";
import { revalidatePath } from "next/cache";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

async function saveSettings(formData: FormData) {
  "use server";
  const keys = [
    "site_name",
    "facebook",
    "twitter",
    "instagram",
    "youtube",
    "ad_header",
    "ad_sidebar",
    "ad_footer",
  ];
  for (const key of keys) {
    await upsertSetting(key, String(formData.get(key) || ""));
  }
  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export default async function SettingsPage() {
  const s = await getSettingsMap();
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold md:text-3xl">Settings</h1>
      <Card>
        <CardContent className="pt-6">
          <form action={saveSettings} className="space-y-4">
            <Field name="site_name" label="Site name" defaultValue={s.site_name || "NewsPortal"} />
            <Field name="facebook" label="Facebook URL" defaultValue={s.facebook} />
            <Field name="twitter" label="Twitter / X URL" defaultValue={s.twitter} />
            <Field name="instagram" label="Instagram URL" defaultValue={s.instagram} />
            <Field name="youtube" label="YouTube URL" defaultValue={s.youtube} />
            <div className="space-y-2">
              <Label htmlFor="ad_header">Header ad HTML</Label>
              <Textarea id="ad_header" name="ad_header" rows={3} defaultValue={s.ad_header} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ad_sidebar">Sidebar ad HTML</Label>
              <Textarea id="ad_sidebar" name="ad_sidebar" rows={3} defaultValue={s.ad_sidebar} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ad_footer">Footer ad HTML</Label>
              <Textarea id="ad_footer" name="ad_footer" rows={3} defaultValue={s.ad_footer} />
            </div>
            <Button type="submit">Save settings</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ name, label, defaultValue }: { name: string; label: string; defaultValue?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} defaultValue={defaultValue || ""} />
    </div>
  );
}
