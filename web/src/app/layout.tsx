import type { Metadata, Viewport } from "next";
import { DM_Sans, Orbitron } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/Web3Provider";

const display = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700", "800"],
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

/** Canonical production URL and Base app registration (dashboard.base.org). */
const DEFAULT_SITE_URL = "https://detroit-become-human.vercel.app";
const DEFAULT_BASE_APP_ID = "69d75f3dfefa3ff9b6fdafc9";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
const baseAppId = process.env.NEXT_PUBLIC_BASE_APP_ID ?? DEFAULT_BASE_APP_ID;

export const metadata: Metadata = {
  title: "Convergence Field — Stability Grid",
  description:
    "A neon cyber-thriller swipe puzzle on Base. Reach the convergence exit.",
  metadataBase: new URL(siteUrl),
  other: { "base:app_id": baseAppId },
  openGraph: {
    title: "Convergence Field — Stability Grid",
    description:
      "Neon swipe puzzle on Base. Daily check-in with builder attribution.",
    images: [{ url: "/app-thumbnail.jpg", width: 1910, height: 1000, alt: "" }],
  },
  icons: { icon: "/app-icon.jpg", apple: "/app-icon.jpg" },
};

export const viewport: Viewport = {
  themeColor: "#05060a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full`}
    >
      <body className="font-body min-h-full bg-[#05060a] text-slate-100 antialiased">
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
