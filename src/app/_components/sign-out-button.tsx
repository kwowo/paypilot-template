"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const result = await signOut({
        fetchOptions: {
          onSuccess: () => {
            // Trigger CSRF token refresh on sign out
            if (typeof window !== "undefined") {
              window.dispatchEvent(new Event("auth-session-change"));
            }
            router.push("/");
            router.refresh();
          },
        },
      });
      console.log("Sign out result:", result);
    } catch (error) {
      console.error("Sign out error:", error);
      // Trigger CSRF token refresh even on error
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth-session-change"));
      }
      // Fallback: Force redirect even if signOut fails
      router.push("/");
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
    >
      Sign out
    </button>
  );
}
