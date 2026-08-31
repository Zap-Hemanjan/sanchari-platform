import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth-guard";
import { validateUpload } from "@/lib/storage/validate-upload";
import { getStorageAdapter } from "@/lib/storage";

export async function POST(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const validation = validateUpload({ type: file.type, size: file.size });
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await getStorageAdapter().upload({
    buffer,
    mimeType: file.type,
  });

  return NextResponse.json(result, { status: 201 });
}
