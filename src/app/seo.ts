import type { Metadata } from "next";

export function createArticleMetadata({
  title,
  description,
  canonicalUrl,
  imageUrl,
}: {
  title: string;
  description?: string | null;
  canonicalUrl?: string;
  imageUrl?: string | null;
}): Metadata {
  const descriptionText = description || `Read ${title} on News Portal.`;

  return {
    title,
    description: descriptionText,
    ...(canonicalUrl ? { alternates: { canonical: canonicalUrl } } : {}),
    openGraph: {
      title,
      description: descriptionText,
      type: "article",
      ...(canonicalUrl ? { url: canonicalUrl } : {}),
      ...(imageUrl ? { images: [{ url: imageUrl, alt: title }] } : {}),
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description: descriptionText,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}
