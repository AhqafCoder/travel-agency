import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EditMyTrips — Edit Your Trip. Create Your Story.",
    template: "%s | EditMyTrips",
  },
  description:
    "India's most experience-driven travel platform. Handcrafted trips, curated destinations, and memories you'll actually remember.",
  metadataBase: new URL("https://editmytrips.com"),
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://editmytrips.com",
    siteName: "EditMyTrips",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@editmytrips",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full`}>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className="min-h-full flex flex-col bg-[#111] text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
