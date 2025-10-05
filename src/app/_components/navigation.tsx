"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { api } from "@/trpc/react";

export function Navigation() {
  const { data: session } = useSession();
  const { data: cartTotal } = api.cart.getTotal.useQuery(undefined, {
    enabled: !!session?.user,
  });

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900">
            T-Shirt Store
          </Link>

          {/* Main Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/category/mens"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Men's
            </Link>
            <Link
              href="/category/womens"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Women's
            </Link>
            <Link
              href="/category/unisex"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Unisex
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {session?.user ? (
              <>
                <Link
                  href="/cart"
                  className="relative text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <span className="text-2xl">🛒</span>
                  {cartTotal && cartTotal.itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartTotal.itemCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/account"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Account
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}