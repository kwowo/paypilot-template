import Link from "next/link";
import { auth } from "@/lib/auth";
import { CheckoutForm } from "@/app/checkout/checkout-form";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((mod) => mod.headers()),
  });

  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/checkout");
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              TeeShop
            </Link>
            <nav className="flex space-x-8">
              <Link href="/cart" className="text-gray-700 hover:text-gray-900">
                Back to Cart
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <CheckoutForm />
      </div>
    </div>
  );
}