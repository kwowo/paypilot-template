import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { withAuthRateLimit } from "@/lib/pg-rate-limiter";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const handlers = toNextJsHandler(auth);

export async function POST(request: NextRequest) {
  return withAuthRateLimit(async (request: NextRequest) => {
    const response = await handlers.POST(request);
    if (response instanceof NextResponse) return response;
    // If it's a plain Response, convert to NextResponse
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  })(request);
}
export async function GET(request: NextRequest) {
  return withAuthRateLimit(async (request: NextRequest) => {
    const response = await handlers.GET(request);
    if (response instanceof NextResponse) return response;
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  })(request);
}