"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { api } from "@/trpc/react";

export function Navbar() {
  const { data: session } = useSession();
  const { data: cartData } = api.cart.get.useQuery(undefined, {
    enabled: !!session,
  });

  const cartItemCount = cartData?.cartItems.reduce((sum: number, item) => sum + item.quantity, 0) ?? 0;

  const handleSignOut = async () => {
    const { signOut } = await import("@/lib/auth-client");
    await signOut();
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              TeeShop
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              All Products
            </Link>
            <Link
              href="/orders"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Orders
            </Link>
          </div>

          {/* Auth & Cart */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link
              href="/checkout"
              className="relative flex items-center text-gray-700 hover:text-gray-900 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Auth Section */}
            {session ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700">
                  Hi, {session.user.name}
                </span>
                <button
                  onClick={handleSignOut}
                  className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
