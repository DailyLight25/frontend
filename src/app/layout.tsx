import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "FaithConnect - Christian AI Blogging Platform",
  description: "Share your faith, build community, and grow together in Christ.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      {/* Removed global cream background */}
      <body className="min-h-screen">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
