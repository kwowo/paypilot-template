import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { db } from "@/server/db";
import { env } from "@/env";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 2, // 2 days
    updateAge: 60 * 60 * 12, // 12 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 2,
    },
  },
  advanced: {
    useSecureCookies: env.NODE_ENV === "production",
  },
});

export type Session = typeof auth.$Infer.Session;
