import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });

export const metadata: Metadata = {
  title: "CakeStore — Premium Bakery Marketplace & SaaS Platform",
  description:
    "Discover top-rated artisan bakeries, customize gourmet cakes, and order online for any occasion. Or launch your own branded bakery website with CakeStore.",
  keywords: [
    "cakes",
    "bakery",
    "order cake online",
    "custom cakes",
    "birthday cakes",
    "wedding cakes",
    "eggless cakes",
    "bakery marketplace",
    "bakery website builder",
  ],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${lora.variable}`}>
      <body className="bg-brand-cream text-brand-espresso font-sans antialiased selection:bg-brand-plum/20">
        {children}
      </body>
    </html>
  );
}
