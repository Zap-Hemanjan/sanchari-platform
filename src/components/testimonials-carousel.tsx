"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

type Testimonial = { id: string; name: string; quote: string };

export function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="min-w-0 flex-[0_0_100%] px-2 sm:flex-[0_0_50%]"
            >
              <blockquote className="h-full rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-slate-700">&ldquo;{testimonial.quote}&rdquo;</p>
                <footer className="mt-3 text-sm font-medium text-navy">
                  {testimonial.name}
                </footer>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
      {testimonials.length > 1 && (
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous testimonial"
            className="rounded-full border border-navy/30 p-2 text-navy transition hover:bg-navy hover:text-white"
          >
            <span aria-hidden>&larr;</span>
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next testimonial"
            className="rounded-full border border-navy/30 p-2 text-navy transition hover:bg-navy hover:text-white"
          >
            <span aria-hidden>&rarr;</span>
          </button>
        </div>
      )}
    </div>
  );
}
