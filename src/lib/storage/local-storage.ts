import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { StorageAdapter, UploadInput, UploadResult } from "@/lib/storage/storage-adapter";

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export class LocalStorageAdapter implements StorageAdapter {
  private readonly uploadsDir: string;
  private readonly publicUrlPrefix: string;

  constructor(options?: { uploadsDir?: string; publicUrlPrefix?: string }) {
    this.uploadsDir =
      options?.uploadsDir ?? path.join(process.cwd(), "public", "uploads");
    this.publicUrlPrefix = options?.publicUrlPrefix ?? "/uploads";
  }

  async upload({ buffer, mimeType }: UploadInput): Promise<UploadResult> {
    const extension = EXTENSION_BY_MIME[mimeType] ?? "bin";
    const filename = `${randomUUID()}.${extension}`;

    // This adapter only ever runs in local dev (production selects
    // CloudinaryStorageAdapter instead — see lib/storage/index.ts). The
    // dynamic path defeats Next's build-time tracing, so it's scoped out
    // explicitly rather than letting it drag the whole project into the
    // serverless bundle.
    await mkdir(this.uploadsDir, { recursive: true });
    await writeFile(
      path.join(/* turbopackIgnore: true */ this.uploadsDir, filename),
      buffer,
    );

    return { url: `${this.publicUrlPrefix}/${filename}` };
  }
}
