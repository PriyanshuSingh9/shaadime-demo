import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";

/* ── Josefin Sans — the single brand typeface ────────────────── */
const josefinPrimary = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

/* Legacy CSS-variable aliases so every existing font-family
   declaration in globals.css keeps working unchanged. */
const josefinHeading = Josefin_Sans({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

const josefinBody = Josefin_Sans({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

const josefinLabel = Josefin_Sans({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"
  ),
  title: "ShaadiMe | Wedding Planning For Modern Indian Couples",
  description:
    "ShaadiMe is a wedding planning partner for modern Indian couples. Tell us what you want, and arrive at your wedding like a guest.",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "ShaadiMe | Wedding Planning For Modern Indian Couples",
    description:
      "ShaadiMe is a wedding planning partner for modern Indian couples. Tell us what you want, and arrive at your wedding like a guest.",
    images: [{ url: "/vercel.svg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShaadiMe | Wedding Planning For Modern Indian Couples",
    description:
      "ShaadiMe is a wedding planning partner for modern Indian couples. Tell us what you want, and arrive at your wedding like a guest.",
    images: ["/vercel.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${josefinPrimary.variable} ${josefinHeading.variable} ${josefinBody.variable} ${josefinLabel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
