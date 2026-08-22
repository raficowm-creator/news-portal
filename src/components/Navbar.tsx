import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSettingsMap } from "@/lib/settings";
import SignOutButton from "./SignOutButton";
import { ThemeToggle } from "./ThemeToggle";
import HeaderSearch from "./HeaderSearch";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  const [categories, settings] = await Promise.all([
    prisma.category.findMany({ take: 6, orderBy: { name: "asc" } }),
    getSettingsMap(),
  ]);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4 py-1 text-xs text-muted-foreground">
        <span>{today}</span>
        <div className="flex items-center gap-3">
          {settings.facebook && (
            <a href={settings.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
              <Facebook className="h-3.5 w-3.5" />
            </a>
          )}
          {settings.twitter && (
            <a href={settings.twitter} target="_blank" rel="noreferrer" aria-label="Twitter">
              <Twitter className="h-3.5 w-3.5" />
            </a>
          )}
          {settings.instagram && (
            <a href={settings.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram className="h-3.5 w-3.5" />
            </a>
          )}
          {settings.youtube && (
            <a href={settings.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
              <Youtube className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
      <nav className="container mx-auto flex flex-wrap items-center gap-3 px-4 py-3">
        <Link href="/" className="text-xl font-bold">
          {settings.site_name || "NewsPortal"}
        </Link>
        <div className="hidden flex-wrap items-center gap-3 text-sm md:flex">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/category/${cat.slug}`} className="text-muted-foreground hover:text-foreground">
              {cat.name}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <HeaderSearch />
          <ThemeToggle />
          {session ? (
            <>
              {(session.user as any).role === "ADMIN" && (
                <Link href="/admin" className="text-sm">
                  Admin
                </Link>
              )}
              <SignOutButton />
            </>
          ) : (
            <Link href="/login" className="text-sm">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
