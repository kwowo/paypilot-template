import type { NextRequest, NextResponse } from "next/server";

const CSRF_TOKEN_LENGTH = 32;
const CSRF_HEADER_NAME = "x-csrf-token";
const CSRF_COOKIE_NAME = "csrf-token";

function getCsrfSecret(): string {
  const secret = process.env.CSRF_SECRET ?? process.env.BETTER_AUTH_SECRET;
  if (!secret) {
    throw new Error("CSRF_SECRET or BETTER_AUTH_SECRET must be set");
  }
  return secret;
}

export function generateCsrfToken(sessionId?: string): string {
  const bytes = new Uint8Array(CSRF_TOKEN_LENGTH);
  crypto.getRandomValues(bytes);
  const randomToken = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

  // If session ID provided, bind token to session
  if (sessionId) {
    return `${sessionId}.${randomToken}`;
  }

  return randomToken;
}

async function hashToken(token: string, sessionId?: string): Promise<string> {
  const encoder = new TextEncoder();
  const secret = getCsrfSecret();

  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  // Include session ID in hash to bind token to user session
  const dataToHash = sessionId ? `${sessionId}:${token}` : token;
  const tokenData = encoder.encode(dataToHash);
  const signature = await crypto.subtle.sign("HMAC", key, tokenData);

  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function verifyCsrfToken(
  token: string,
  hashedToken: string,
  sessionId?: string
): Promise<boolean> {
  if (!token || !hashedToken) {
    console.warn('[CSRF DEBUG] verifyCsrfToken: Missing token or hashedToken', { token, hashedToken, sessionId });
    return false;
  }

  // If token is bound to session, verify session ID matches
  let tokenSessionId: string | undefined = undefined;
  if (token.includes('.')) {
    [tokenSessionId] = token.split('.');
    if (sessionId && tokenSessionId !== sessionId) {
      console.warn('[CSRF DEBUG] verifyCsrfToken: Session ID mismatch', { tokenSessionId, sessionId, token });
      return false; // Token belongs to different session
    }
  }

  const expectedHash = await hashToken(token, sessionId);

  if (expectedHash.length !== hashedToken.length) {
    console.warn('[CSRF DEBUG] verifyCsrfToken: Hash length mismatch', { expectedHash, hashedToken, token, sessionId, tokenSessionId });
    return false;
  }

  let result = 0;
  for (let i = 0; i < expectedHash.length; i++) {
    result |= expectedHash.charCodeAt(i) ^ hashedToken.charCodeAt(i);
  }

  if (result !== 0) {
    console.warn('[CSRF DEBUG] verifyCsrfToken: Hash mismatch', { expectedHash, hashedToken, token, sessionId, tokenSessionId });
  } else {
    console.info('[CSRF DEBUG] verifyCsrfToken: Token valid', { token, sessionId, tokenSessionId });
  }

  return result === 0;
}

export function getCsrfTokenFromRequest(request: NextRequest): string | null {
  const headerToken = request.headers.get(CSRF_HEADER_NAME);
  if (headerToken) return headerToken;

  return null;
}

export function getCsrfHashFromCookie(request: NextRequest): string | null {
  return request.cookies.get(CSRF_COOKIE_NAME)?.value ?? null;
}

export async function setCsrfCookie(
  response: NextResponse,
  token: string,
  sessionId?: string
): Promise<void> {
  const hashedToken = await hashToken(token, sessionId);

  response.cookies.set(CSRF_COOKIE_NAME, hashedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
}

export function shouldCheckCsrf(request: NextRequest): boolean {
  const method = request.method;
  const pathname = request.nextUrl.pathname;

  if (!["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    return false;
  }

  if (pathname.startsWith("/api/auth/")) {
    return false;
  }

  return true;
}

export async function validateCsrfToken(
  request: NextRequest,
  sessionId?: string
): Promise<boolean> {
  if (!shouldCheckCsrf(request)) {
    console.info('[CSRF DEBUG] validateCsrfToken: Skipping CSRF check for method/path', { method: request.method, path: request.nextUrl.pathname });
    return true;
  }

  const token = getCsrfTokenFromRequest(request);
  const hashedToken = getCsrfHashFromCookie(request);

  console.info('[CSRF DEBUG] validateCsrfToken: Checking CSRF', { token, hashedToken, sessionId, method: request.method, path: request.nextUrl.pathname });

  if (!token || !hashedToken) {
    console.warn('[CSRF DEBUG] validateCsrfToken: Missing token or hashedToken', { token, hashedToken, sessionId });
    return false;
  }

  return verifyCsrfToken(token, hashedToken, sessionId);
}
