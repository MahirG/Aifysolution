import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "qabeza-authority",
    timestamp: new Date().toISOString()
  });
}
