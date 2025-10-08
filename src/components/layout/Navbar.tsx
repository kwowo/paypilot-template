"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { signOut } from "@/lib/auth-client";
import { api } from "@/trpc/react";

export function Navbar() {
  const { data: session } = useSession();
  const { data: cartSummary } = api.cart.getSummary.useQuery(undefined, {
    enabled: !!session,
  });

  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900">
            TeeStore
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/products"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              All Products
            </Link>
            <Link
              href="/products?category=graphic-tees"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Graphic Tees
            </Link>
            <Link
              href="/products?category=plain-tees"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Plain Tees
            </Link>
            <Link
              href="/products?category=vintage"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Vintage
            </Link>
            <Link
              href="/products?category=sports"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Sports
            </Link>
          </div>

          {/* Right side - Cart and Auth */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            {session && (
              <Link
                href="/cart"
                className="relative text-gray-700 hover:text-gray-900"
              >
                <div className="p-2">
                  🛒
                  {cartSummary && cartSummary.totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartSummary.totalItems}
                    </span>
                  )}
                </div>
              </Link>
            )}

            {/* Auth Section */}
            {session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/orders"
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  Orders
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">
                    Hi, {session.user.name}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/sign-in"
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 font-medium"
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