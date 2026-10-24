import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import SyncUserWithConvex from "@/components/SyncUserWithConvex";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Ticketr — Live Event Ticketing & Marketplace",
  description:
    "Discover and book verified tickets for live concerts, stadium sports, festivals, and comedy shows.",
  icons: {
    icon: [
      { url: "/ticketr-favicon.svg", type: "image/svg+xml" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/ticketr-favicon.svg",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 dark:bg-[#07090E] text-slate-900 dark:text-slate-100 transition-colors duration-200`}
      >
        <ConvexClientProvider>
          <ClerkProvider>
            <Header />
            <SyncUserWithConvex />
            {children}
            <Toaster />
          </ClerkProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
