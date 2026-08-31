import type { StorageAdapter } from "@/lib/storage/storage-adapter";
import { LocalStorageAdapter } from "@/lib/storage/local-storage";
import { CloudinaryStorageAdapter } from "@/lib/storage/cloudinary-storage";

export function getStorageAdapter(): StorageAdapter {
  if (process.env.CLOUDINARY_URL) {
    return new CloudinaryStorageAdapter();
  }
  // LOCAL_UPLOADS_DIR lets tests redirect writes away from public/uploads.
  return new LocalStorageAdapter(
    process.env.LOCAL_UPLOADS_DIR
      ? { uploadsDir: process.env.LOCAL_UPLOADS_DIR }
      : undefined,
  );
}

export type { StorageAdapter, UploadInput, UploadResult } from "@/lib/storage/storage-adapter";
