import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ApolloProvider from "@/components/providers/ApolloProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Japan Fest 2026 — Tokyo Natsu Matsuri",
  description: "Rayakan keajaiban budaya Jepang di Tokyo Natsu Matsuri 2026. Kembang api, parade budaya, kuliner autentik, dan pengalaman tak terlupakan.",
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "Japan Fest 2026 — Tokyo Natsu Matsuri",
    description: "Rayakan keajaiban budaya Jepang di Tokyo Natsu Matsuri 2026.",
    images: [{ url: "/logo.jpg", width: 512, height: 512, alt: "Japan Fest Logo" }],
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ApolloProvider>{children}</ApolloProvider>
      </body>
    </html>
  );
}
