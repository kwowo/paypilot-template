"use client";

import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { httpBatchStreamLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { useState, useEffect } from "react";
import SuperJSON from "superjson";

import { type AppRouter } from "@/server/api/root";
import { createQueryClient } from "./query-client";

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (typeof window === "undefined") {
    return createQueryClient();
  }
  clientQueryClientSingleton ??= createQueryClient();

  return clientQueryClientSingleton;
};

function getCsrfToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("csrf-token");
}

function setCsrfToken(token: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("csrf-token", token);
}

export const api = createTRPCReact<AppRouter>();

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch("/api/trpc/csrf.get");
        const headerToken = response.headers.get("x-csrf-token");
        if (headerToken) {
          setCsrfToken(headerToken);
        } else {
          console.error("No x-csrf-token header in response");
        }
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    };

    void fetchCsrfToken();

    // Listen for session changes to refetch CSRF token
    const handleSessionChange = () => {
      // Clear old token and fetch new one
      sessionStorage.removeItem("csrf-token");
      void fetchCsrfToken();
    };

    // Custom event for when user logs in/out
    window.addEventListener("auth-session-change", handleSessionChange);

    return () => {
      window.removeEventListener("auth-session-change", handleSessionChange);
    };
  }, []);

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchStreamLink({
          transformer: SuperJSON,
          url: getBaseUrl() + "/api/trpc",
          headers: () => {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            
            const token = getCsrfToken();
            if (token) {
              headers.set("x-csrf-token", token);
              // console.log("Adding CSRF token to request:", token.substring(0, 10) + "...");
            } else {
              console.warn("No CSRF token available for request");
            }
            
            return headers;
          },
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
