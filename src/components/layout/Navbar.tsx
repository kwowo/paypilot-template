"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { signOut } from "@/lib/auth-client";
import { api } from "@/trpc/react";

export function Navbar() {
  const { data: session } = useSession();
  const cartSummary = api.cart.getSummary.useQuery(undefined, {
    enabled: !!session,
  });

  return (
    <nav className="fixed top-0 z-50 w-full bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              T-Shirt Store
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                All Products
              </Link>
              <Link
                href="/category/mens"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Men&apos;s
              </Link>
              <Link
                href="/category/womens"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Women&apos;s
              </Link>
              <Link
                href="/category/unisex"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Unisex
              </Link>
              <Link
                href="/about"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                About
              </Link>
            </div>
          </div>

          {/* Cart and Auth */}
          <div className="flex items-center space-x-4">
            {session && (
              <Link
                href="/cart"
                className="relative flex items-center text-gray-700 hover:text-gray-900"
              >
                <svg
                  className="h-6 w-6"
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
                {cartSummary.data?.totalItems ? (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {cartSummary.data.totalItems}
                  </span>
                ) : null}
              </Link>
            )}

            {session ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/account"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Account
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-sm font-medium text-red-600 hover:text-red-800"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/sign-in"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}