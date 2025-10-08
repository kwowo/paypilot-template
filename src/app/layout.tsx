import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "TeeStore - Premium T-Shirts",
  description: "Shop premium quality t-shirts in various designs, sizes, and colors",
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
      <body>
        <TRPCReactProvider>
          <Navbar />
          <main className="pt-16 min-h-screen bg-gray-50">
            {children}
          </main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
