import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import Navigation from "@/app/_components/navigation";

export const metadata: Metadata = {
  title: "T-Shirt Store - Premium Quality T-Shirts",
  description: "Discover our collection of premium quality, comfortable, and stylish t-shirts for everyone.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="min-h-screen bg-gray-50">
        <TRPCReactProvider>
          <Navigation />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
