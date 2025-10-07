import { redirect } from "next/navigation";
import Link from "next/link";

import { auth } from "@/lib/auth";
import { HydrateClient } from "@/trpc/server";

export default async function AccountPage() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((mod) => mod.headers()),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <HydrateClient>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            My Account
          </h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {session.user.name ?? session.user.email}!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Account Information */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900">{session.user.name ?? "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{session.user.email}</p>
              </div>
            </div>
            <button className="mt-4 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
              Edit Profile
            </button>
          </div>

          {/* Quick Actions */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            <div className="mt-4 space-y-3">
              <Link
                href="/cart"
                className="block rounded-md border border-gray-200 p-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                View Shopping Cart
              </Link>
              <Link
                href="/products"
                className="block rounded-md border border-gray-200 p-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Continue Shopping
              </Link>
              <button className="w-full rounded-md border border-gray-200 p-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
                Order History
              </button>
              <button className="w-full rounded-md border border-gray-200 p-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
                Address Book
              </button>
            </div>
          </div>
        </div>

        {/* Recent Orders Placeholder */}
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
          <div className="mt-4 text-center py-8">
            <p className="text-gray-500">No orders yet.</p>
            <Link
              href="/products"
              className="mt-2 inline-block rounded-md bg-black px-6 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}