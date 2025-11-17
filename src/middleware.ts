import { type NextRequest, NextResponse } from "next/server";
import {
  validateCsrfToken,
  generateCsrfToken,
  setCsrfCookie,
  getCsrfHashFromCookie,
  shouldCheckCsrf,
} from "@/lib/csrf";

// const ENFORCE_CSRF_TOKENS = process.env.ENFORCE_CSRF_TOKENS !== "false";
const ENFORCE_CSRF_TOKENS = false;

// Helper to extract session ID from Better Auth session cookie
function getSessionIdFromRequest(request: NextRequest): string | undefined {
  // Better Auth stores session data in a cookie named "better-auth.session_data"
  const sessionDataCookie = request.cookies.get("better-auth.session_data");
  if (!sessionDataCookie) return undefined;

  try {
    // Decode the session data to get the actual session ID
    const sessionData = JSON.parse(sessionDataCookie.value) as {
      session?: {
        session?: {
          id?: string;
        };
      };
    };
    return sessionData?.session?.session?.id;
  } catch {
    return undefined;
  }
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Get session ID for CSRF token binding
  const sessionId = getSessionIdFromRequest(request);

  const existingCsrfHash = getCsrfHashFromCookie(request);

  // Generate new CSRF token if none exists or on csrf.get endpoint
  if (!existingCsrfHash || request.nextUrl.pathname.includes("/api/trpc/csrf.get")) {
    const newToken = generateCsrfToken(sessionId);
    await setCsrfCookie(response, newToken, sessionId);
    response.headers.set("x-csrf-token", newToken);
  }

  // Validate CSRF token for state-changing requests
  if (ENFORCE_CSRF_TOKENS && shouldCheckCsrf(request)) {
    const isValidCsrf = await validateCsrfToken(request, sessionId);

    if (!isValidCsrf) {
      console.warn({
        event: "csrf_validation_failed",
        path: request.nextUrl.pathname,
        method: request.method,
        ip: request.headers.get("x-forwarded-for"),
        sessionId: sessionId ? "present" : "missing",
      });

      return NextResponse.json(
        { error: "Invalid CSRF token" },
        { status: 403 }
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
