"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-gray-900">TeeShop</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/shop" 
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Shop
            </Link>
            <Link 
              href="/shop/men" 
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Men
            </Link>
            <Link 
              href="/shop/women" 
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Women
            </Link>
            <Link 
              href="/shop/kids" 
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Kids
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              About
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link 
              href="/cart" 
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cart (0)
            </Link>

            {/* Authentication */}
            {session ? (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/orders" 
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Orders
                </Link>
                <span className="text-sm text-gray-600">
                  Welcome, {session.user.name}
                </span>
                <button 
                  onClick={() => signOut()} 
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/sign-in" 
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/sign-up" 
                  className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
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