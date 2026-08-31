"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

type Destination = { id: string; name: string; location: string; imageUrl: string | null };

export function DestinationsCarousel({ destinations }: { destinations: Destination[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", dragFree: true });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {destinations.map((destination) => (
            <div
              key={destination.id}
              className="relative h-56 w-64 shrink-0 overflow-hidden rounded-xl"
            >
              {destination.imageUrl ? (
                <Image
                  src={destination.imageUrl}
                  alt={destination.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-navy to-terracotta" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-left text-white">
                <p className="font-medium">{destination.name}</p>
                <p className="text-xs text-white/80">{destination.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {destinations.length > 1 && (
        <div className="mt-4 flex justify-center gap-3">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous destination"
            className="rounded-full border border-navy/30 p-2 text-navy transition hover:bg-navy hover:text-white"
          >
            <span aria-hidden>&larr;</span>
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next destination"
            className="rounded-full border border-navy/30 p-2 text-navy transition hover:bg-navy hover:text-white"
          >
            <span aria-hidden>&rarr;</span>
          </button>
        </div>
      )}
    </div>
  );
}
