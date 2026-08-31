import { v2 as cloudinary } from "cloudinary";
import type { StorageAdapter, UploadInput, UploadResult } from "@/lib/storage/storage-adapter";

// Reads config from the CLOUDINARY_URL env var automatically (Cloudinary's
// SDK convention) — no explicit cloudinary.config() call needed.
export class CloudinaryStorageAdapter implements StorageAdapter {
  async upload({ buffer, mimeType }: UploadInput): Promise<UploadResult> {
    const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "sanchari",
    });
    return { url: result.secure_url };
  }
}
