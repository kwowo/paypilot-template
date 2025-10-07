import { redirect } from "next/navigation";
import Link from "next/link";

import { auth } from "@/lib/auth";
import { HydrateClient } from "@/trpc/server";

export default async function CartPage() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((mod) => mod.headers()),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <HydrateClient>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Your Shopping Cart
        </h1>

        {/* Cart content will be implemented with client components */}
        <div className="mt-8">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Your cart is empty
              </h3>
              <p className="mt-2 text-gray-500">
                Start shopping to add items to your cart.
              </p>
              <Link
                href="/products"
                className="mt-4 inline-block rounded-md bg-black px-6 py-2 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}