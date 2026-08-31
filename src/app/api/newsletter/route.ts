import { NextRequest, NextResponse } from "next/server";
import { subscribeToNewsletter } from "@/lib/content/newsletter";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  try {
    await subscribeToNewsletter(body?.email);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request." },
      { status: 400 },
    );
  }
}
