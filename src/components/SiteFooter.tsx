import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

export default function SiteFooter({
  settings,
}: {
  settings: Record<string, string>;
}) {
  const social = [
    { href: settings.facebook, icon: Facebook, label: "Facebook" },
    { href: settings.twitter, icon: Twitter, label: "Twitter" },
    { href: settings.instagram, icon: Instagram, label: "Instagram" },
    { href: settings.youtube, icon: Youtube, label: "YouTube" },
  ].filter((s) => s.href);

  return (
    <footer className="mt-12 border-t bg-muted/40">
      <div className="container mx-auto grid gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold">{settings.site_name || "NewsPortal"}</h3>
          <p className="mt-2 text-sm text-muted-foreground">Stay updated with the latest stories.</p>
          <div className="mt-4 flex gap-3">
            {social.map((s) => {
              const Icon = s.icon;
              return (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="text-muted-foreground hover:text-foreground">
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Links</h4>
          <div className="mt-2 flex flex-col gap-1 text-sm">
            <Link href="/">Home</Link>
            <Link href="/search">Search</Link>
            <Link href="/login">Login</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Newsletter</h4>
          <p className="mb-3 mt-2 text-sm text-muted-foreground">Get headlines in your inbox.</p>
          <NewsletterForm />
        </div>
      </div>
      {settings.ad_footer ? (
        <div className="border-t p-4 text-center" dangerouslySetInnerHTML={{ __html: settings.ad_footer }} />
      ) : null}
    </footer>
  );
}
