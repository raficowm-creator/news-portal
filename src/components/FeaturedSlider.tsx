"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { useEffect } from "react";

type Slide = {
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string | null;
  category: { name: string; slug: string };
};

export default function FeaturedSlider({ slides }: { slides: Slide[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4500 })]);

  useEffect(() => {
    emblaApi?.reInit();
  }, [emblaApi, slides.length]);

  if (!slides.length) return null;

  return (
    <div className="overflow-hidden rounded-xl" ref={emblaRef}>
      <div className="flex">
        {slides.map((slide) => (
          <div key={slide.slug} className="relative min-w-0 flex-[0_0_100%]">
            <img
              src={slide.imageUrl || "https://picsum.photos/1200/500"}
              alt={slide.title}
              className="h-64 w-full object-cover md:h-[420px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 p-5 text-white md:p-8">
              <Link href={`/category/${slide.category.slug}`} className="text-xs uppercase tracking-wide text-red-300">
                {slide.category.name}
              </Link>
              <Link href={`/articles/${slide.slug}`}>
                <h2 className="mt-1 text-2xl font-bold md:text-4xl">{slide.title}</h2>
              </Link>
              <p className="mt-2 hidden max-w-2xl text-sm text-white/80 md:block">{slide.excerpt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
