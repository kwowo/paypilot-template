// RATE LIMITING DISABLED FOR TESTING
// To re-enable, restore from git history or backup

import type { NextRequest, NextResponse } from "next/server";

console.error("\n" + "=".repeat(80));
console.error("🚫 [RATE LIMITER] COMPLETELY DISABLED FOR TESTING");
console.error("   ⚠️  WARNING: All requests are allowed through without limits!");
console.error("=".repeat(80) + "\n");

// Pass-through wrapper that does nothing
export function withAuthRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse
) {
  return handler;
}

// Always return true (allow all requests)
export async function checkCartRateLimit(_headers: Headers): Promise<boolean> {
  return true;
}

// Always return true (allow all requests)
export async function checkOrderRateLimit(_headers: Headers): Promise<boolean> {
  return true;
}
