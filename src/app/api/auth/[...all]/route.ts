import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { withAuthRateLimit } from "@/lib/pg-rate-limiter";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "@/env";

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
  // Handle GET requests to sign-out by using Better Auth's signOut API
  if (request.nextUrl.pathname === "/api/auth/sign-out") {
    return withAuthRateLimit(async (request: NextRequest) => {
      // Get the session token from cookies
      const session = await auth.api.getSession({ headers: request.headers });

      // Create redirect response
      const redirectUrl = new URL("/", env.BETTER_AUTH_URL ?? request.headers.get("origin") ?? request.url);
      const redirectResponse = NextResponse.redirect(redirectUrl);

      if (session) {
        // Sign out the user
        await auth.api.signOut({ headers: request.headers });

        // Manually clear the session cookies
        const cookieOptions = {
          path: "/",
          maxAge: 0,
          expires: new Date(0),
          httpOnly: true,
          secure: env.NODE_ENV === "production",
          sameSite: "lax" as const,
        };

        // Clear both session token and cache token
        redirectResponse.cookies.set("better-auth.session_token", "", cookieOptions);
        redirectResponse.cookies.set("better-auth.session_data.cache", "", cookieOptions);
      }

      return redirectResponse;
    })(request);
  }

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