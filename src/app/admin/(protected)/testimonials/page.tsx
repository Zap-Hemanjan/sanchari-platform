import { listTestimonials } from "@/lib/content/testimonials";
import { TestimonialManager } from "@/components/admin/testimonial-manager";

export default async function AdminTestimonialsPage() {
  const testimonials = await listTestimonials({ publishedOnly: false });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Testimonials</h1>
      <TestimonialManager initialTestimonials={testimonials} />
    </div>
  );
}
