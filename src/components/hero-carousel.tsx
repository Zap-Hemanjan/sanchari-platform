"use client";

import { useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

// Auto-rotating background — replaces a single static hero photo with an
// "ongoing" slideshow, matching the live site's animated-hero feel without
// needing actual video assets.
export function HeroCarousel({ images }: { images: string[] }) {
  // Reading ref.current during render is flagged by react-hooks/refs; a
  // useState initializer creates the plugin instance exactly once instead.
  const [autoplayPlugin] = useState(() =>
    Autoplay({ delay: 4500, stopOnInteraction: false }),
  );
  const [emblaRef] = useEmblaCarousel({ loop: true }, [autoplayPlugin]);

  if (images.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden" ref={emblaRef}>
      <div className="flex h-full">
        {images.map((src, index) => (
          <div key={src} className="relative h-full min-w-0 flex-[0_0_100%]">
            <Image
              src={src}
              alt=""
              fill
              unoptimized
              priority={index === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
