import rateLimit from "express-rate-limit";
import { PostgresStore } from "@acpr/rate-limit-postgresql";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

// PostgreSQL connection configuration with timeouts
const databaseConnection = {
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST ?? 'localhost',
  database: process.env.POSTGRES_DB,
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
  // Add connection timeouts to prevent hanging
  connectionTimeoutMillis: 3000, // 3 seconds to establish connection
  query_timeout: 2000, // 2 seconds for queries
  statement_timeout: 2000, // 2 seconds for statements
};

// Check if PostgreSQL credentials are configured
const isPostgresConfigured =
  process.env.POSTGRES_USER &&
  process.env.POSTGRES_PASSWORD &&
  process.env.POSTGRES_DB;

// Log rate limiter configuration on startup
if (isPostgresConfigured) {
  console.error("\n" + "=".repeat(80));
  console.error("✅ [RATE LIMITER] Using PostgreSQL storage for distributed rate limiting");
  console.error(`   Host: ${databaseConnection.host}:${databaseConnection.port}`);
  console.error(`   Database: ${databaseConnection.database}`);
  console.error("=".repeat(80) + "\n");
} else {
  console.error("\n" + "=".repeat(80));
  console.error("⚠️  [RATE LIMITER] PostgreSQL not configured - using IN-MEMORY fallback");
  console.error("   ⚠️  WARNING: In-memory rate limiting is NOT distributed across servers!");
  console.error("   ⚠️  For production, set POSTGRES_USER, POSTGRES_PASSWORD, and POSTGRES_DB in .env");
  console.error("=".repeat(80) + "\n");
}

// Create separate store instances for each rate limiter with unique prefixes
// If PostgreSQL is not configured, rateLimit will use default in-memory MemoryStore
const authStore = isPostgresConfigured ? new PostgresStore(databaseConnection, "auth_limiter") : undefined;
const sessionStore = isPostgresConfigured ? new PostgresStore(databaseConnection, "session_limiter") : undefined;
const cartStore = isPostgresConfigured ? new PostgresStore(databaseConnection, "cart_limiter") : undefined;
const orderStore = isPostgresConfigured ? new PostgresStore(databaseConnection, "order_limiter") : undefined;

type ExpressMiddleware = (
  req: unknown,
  res: unknown,
  next: (err?: Error) => void
) => void;

// Helper to extract IP from headers
const getIPFromHeaders = (headers: Record<string, unknown>): string => {
  const xfwd = typeof headers["x-forwarded-for"] === "string" ? headers["x-forwarded-for"] : undefined;
  const xreal = typeof headers["x-real-ip"] === "string" ? headers["x-real-ip"] : undefined;
  return xfwd ?? xreal ?? "0.0.0.0";
};

// Example: 10 requests per 15 minutes for auth mutations (sign-in, sign-up, etc.)
const authLimiter = isPostgresConfigured ? rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  store: authStore,
  keyGenerator: (req: { headers: Record<string, unknown> }) => {
    return getIPFromHeaders(req.headers || {});
  },
  handler: (_req, _res) => {
    // This handler is not used directly; see below for Next.js integration
  },
}) as unknown as ExpressMiddleware : null;

// Session checks: 100 requests per 15 minutes (more lenient for read-only operations)
const sessionLimiter = isPostgresConfigured ? rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  store: sessionStore,
  keyGenerator: (req: { headers: Record<string, unknown> }) => {
    return getIPFromHeaders(req.headers || {});
  },
  handler: (_req, _res) => {
    // This handler is not used directly; see below for Next.js integration
  },
}) as unknown as ExpressMiddleware : null;

// Cart operations: 30 requests per minute
const cartLimiter = isPostgresConfigured ? rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  store: cartStore,
  keyGenerator: (req: { headers: Record<string, unknown> }) => {
    return getIPFromHeaders(req.headers || {});
  },
  handler: (_req, _res) => {
    // This handler is not used directly; see below for Next.js integration
  },
}) as unknown as ExpressMiddleware : null;

// Order creation: 10 requests per hour
const orderLimiter = isPostgresConfigured ? rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  store: orderStore,
  keyGenerator: (req: { headers: Record<string, unknown> }) => {
    return getIPFromHeaders(req.headers || {});
  },
  handler: (_req, _res) => {
    // This handler is not used directly; see below for Next.js integration
  },
}) as unknown as ExpressMiddleware : null;

// Helper to check rate limit with express-rate-limit middleware
async function checkRateLimit(
  limiter: ExpressMiddleware | null,
  headers: Headers
): Promise<boolean> {
  // If rate limiter is not configured (PostgreSQL not available), allow all requests
  if (!limiter) {
    return true;
  }

  const mockReq = { headers: Object.fromEntries(headers.entries()) };
  const mockRes = {
    setHeader: () => undefined,
    status: () => ({ send: () => undefined }),
  };

  let completed = false;

  try {
    // Add timeout to prevent hanging if PostgreSQL is slow/unreachable
    const result = await Promise.race([
      new Promise<{ success: boolean }>((resolve, reject) => {
        limiter(mockReq, mockRes, (err?: Error) => {
          if (!completed) {
            completed = true;
            if (err) {
              reject(err);
            } else {
              resolve({ success: true });
            }
          }
        });
      }),
      new Promise<{ success: boolean }>((resolve) =>
        setTimeout(() => {
          if (!completed) {
            completed = true;
            logger.warn({
              event: "rate_limit_timeout",
              ip: headers.get("x-forwarded-for") ?? headers.get("x-real-ip") ?? "unknown",
            }, "Rate limit check timed out - PostgreSQL may be slow or unreachable");
            resolve({ success: false });
          }
        }, 5000)
      )
    ]);

    return result.success;
  } catch {
    // Rate limit exceeded - block the request
    return false;
  }
}

// Helper to wrap Next.js API route handlers with rate limiting
export function withAuthRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse
) {
  return async function rateLimitedHandler(req: NextRequest): Promise<NextResponse> {
    // Determine if this is a session check (read-only) or auth mutation (write)
    const url = new URL(req.url);
    const isSessionCheck = url.pathname.includes('/get-session');

    // Choose appropriate rate limiter based on operation type
    const limiter = isSessionCheck ? sessionLimiter : authLimiter;
    const limiterType = isSessionCheck ? 'session' : 'auth';

    // If rate limiter is not configured, allow the request
    if (!limiter) {
      return await handler(req);
    }

    // Create a mock response object for express-rate-limit
    const mockRes = {
      setHeader: () => undefined,
      status: () => ({ send: () => undefined }),
    };

    let completed = false;

    try {
      // Add timeout to prevent hanging
      const result = await Promise.race([
        new Promise<{ success: boolean; reason?: string }>((resolve, reject) => {
          // Express middleware signature, safe for our usage
          limiter(req, mockRes, (err?: Error) => {
            if (!completed) {
              completed = true;
              if (err) {
                reject(err);
              } else {
                resolve({ success: true });
              }
            }
          });
        }),
        new Promise<{ success: boolean; reason: string }>((resolve) =>
          setTimeout(() => {
            if (!completed) {
              completed = true;
              logger.warn({
                event: "rate_limit_timeout",
                endpoint: `/api/auth (${limiterType})`,
                ip: req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown",
              }, `${limiterType} rate limit check timed out - PostgreSQL may be slow or unreachable`);
              resolve({ success: false, reason: 'timeout' });
            }
          }, 5000)
        )
      ]);

      // Check if the operation succeeded
      if (result.success) {
        return await handler(req);
      } else {
        // Timeout occurred - return 503 Service Unavailable
        return NextResponse.json(
          {
            error: "Service temporarily unavailable, please try again",
            message: "Service temporarily unavailable, please try again"
          },
          {
            status: 503,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": "60",
            },
          }
        );
      }
    } catch {
      // Rate limit exceeded
      logger.warn({
        event: "rate_limit_exceeded",
        endpoint: `/api/auth (${limiterType})`,
        ip: req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown",
        userAgent: req.headers.get("user-agent") ?? "unknown",
      }, `${isSessionCheck ? 'Session check' : 'Authentication'} rate limit exceeded`);

      // Return error in Better Auth compatible format
      return NextResponse.json(
        {
          error: isSessionCheck
            ? "Too many session checks, please try again later"
            : "Too many authentication attempts, please try again later",
          message: isSessionCheck
            ? "Too many session checks, please try again later"
            : "Too many authentication attempts, please try again later"
        },
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Remaining": "0",
            "Retry-After": "900",
          },
        }
      );
    }
  };
}

// Export rate limit check functions for tRPC middleware
export async function checkCartRateLimit(headers: Headers): Promise<boolean> {
  const allowed = await checkRateLimit(cartLimiter, headers);

  if (!allowed) {
    logger.warn({
      event: "rate_limit_exceeded",
      endpoint: "cart",
      ip: headers.get("x-forwarded-for") ?? headers.get("x-real-ip") ?? "unknown",
      userAgent: headers.get("user-agent") ?? "unknown",
    }, "Cart rate limit exceeded");
  }
  return allowed;
}

export async function checkOrderRateLimit(headers: Headers): Promise<boolean> {
  const allowed = await checkRateLimit(orderLimiter, headers);
  if (!allowed) {
    logger.warn({
      event: "rate_limit_exceeded",
      endpoint: "order",
      ip: headers.get("x-forwarded-for") ?? headers.get("x-real-ip") ?? "unknown",
      userAgent: headers.get("user-agent") ?? "unknown",
    }, "Order rate limit exceeded");
  }
  return allowed;
}