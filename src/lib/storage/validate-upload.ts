export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB

// SVG is deliberately excluded even though it's an "image" — it can embed
// <script>, making it an XSS vector if ever served/rendered inline.
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export type UploadValidationResult =
  | { valid: true }
  | { valid: false; error: string };

export function validateUpload(file: {
  type: string;
  size: number;
}): UploadValidationResult {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type "${file.type}". Allowed: JPEG, PNG, WEBP, GIF.`,
    };
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      valid: false,
      error: `File is too large. Maximum size is ${MAX_UPLOAD_BYTES / (1024 * 1024)}MB.`,
    };
  }

  return { valid: true };
}
