import { z } from "zod";

// Accepts absolute URLs (Cloudinary in production) and root-relative
// paths like "/uploads/xyz.webp" (what the local storage adapter returns
// in dev) — plain z.string().url() rejects the latter outright.
export const imageUrlSchema = z
  .string()
  .refine((value) => /^https?:\/\//.test(value) || value.startsWith("/"), {
    message: "Must be a valid URL or an uploaded file path.",
  });
