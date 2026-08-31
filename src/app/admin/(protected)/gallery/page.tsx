import { listMedia } from "@/lib/content/media";
import { GalleryManager } from "@/components/admin/gallery-manager";

export default async function AdminGalleryPage() {
  const media = await listMedia();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Gallery</h1>
      <GalleryManager initialMedia={media} />
    </div>
  );
}
