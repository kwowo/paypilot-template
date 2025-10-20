"use client";

import { useEffect } from "react";
import { api } from "@/trpc/react";

export function useCsrfToken() {
  const queryResult = api.csrf.get.useQuery();
  
  useEffect(() => {
    if (queryResult.data?.token && typeof window !== "undefined") {
      sessionStorage.setItem("csrf-token", queryResult.data.token);
    }
  }, [queryResult.data?.token]);
  
  return { 
    token: queryResult.data?.token ?? null, 
    isLoading: queryResult.isLoading,
    refetch: queryResult.refetch
  };
}


export function getCsrfHeaders(token: string | null): HeadersInit {
  if (!token) return {};
  
  return {
    "x-csrf-token": token,
  };
}

export async function fetchWithCsrf(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Use imperative tRPC call for CSRF token
  const tokenData = await api.useContext().client.csrf.get.query();
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "x-csrf-token": tokenData.token,
    },
  });
}
