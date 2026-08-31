import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth-guard";
import { deleteMedia } from "@/lib/content/media";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, context: RouteContext) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  await deleteMedia(id);
  return NextResponse.json({ ok: true });
}
