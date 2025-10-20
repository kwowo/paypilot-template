import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { generateCsrfToken } from "@/lib/csrf";

export const csrfRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    // Get session ID from context (if user is logged in)
    const sessionId = ctx.session?.session?.id;

    // Generate CSRF token bound to session
    const token = generateCsrfToken(sessionId);

    if (ctx.headers) {
      ctx.headers.set("x-csrf-token", token);
    }

    return { token };
  }),
});
