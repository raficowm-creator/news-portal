import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import BreakingTicker from "@/components/BreakingTicker";
import { prisma } from "@/lib/prisma";
import { getSettingsMap } from "@/lib/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [breaking, settings] = await Promise.all([
    prisma.article.findMany({
      where: { published: true, breaking: true },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { slug: true, title: true },
    }),
    getSettingsMap(),
  ]);

  return (
    <>
      <Navbar />
      <BreakingTicker items={breaking} />
      {settings.ad_header ? (
        <div className="container mx-auto px-4 py-3" dangerouslySetInnerHTML={{ __html: settings.ad_header }} />
      ) : null}
      <main className="container mx-auto px-4 py-6">{children}</main>
      <SiteFooter settings={settings} />
    </>
  );
}
