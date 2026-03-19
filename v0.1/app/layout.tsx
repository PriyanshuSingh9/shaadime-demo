import type { Metadata } from "next";
import {
  Inter,
  Playfair_Display,
  Teko,
} from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const teko = Teko({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ShaadiMe | Wedding Planning For Modern Indian Couples",
  description:
    "ShaadiMe is a wedding planning partner for modern Indian couples. Tell us what you want, and arrive at your wedding like a guest.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${teko.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
