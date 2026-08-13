import { NextResponse } from "next/server";

/**
 * GET /api/health
 *
 * Simple health-check endpoint. Returns a static "ok" status plus the
 * current server timestamp. No database, auth, or external calls.
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "ThinkLens",
    timestamp: new Date().toISOString(),
  });
}
