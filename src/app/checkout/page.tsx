import { type Metadata } from "next";
import { CheckoutForm } from "@/app/checkout/_components/checkout-form";

export const metadata: Metadata = {
  title: "Checkout | Shopping Cart",
  description: "Complete your purchase",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <CheckoutForm />
      </div>
    </div>
  );
}