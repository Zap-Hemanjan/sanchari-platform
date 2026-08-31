import { NextRequest, NextResponse } from "next/server";
import { createInquiry } from "@/lib/content/inquiries";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  try {
    const created = await createInquiry(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request." },
      { status: 400 },
    );
  }
}
