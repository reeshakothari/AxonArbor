import type { Metadata, Viewport } from "next";
import { Gelasio, Inter, Montserrat } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

// Only the faces used above the fold on every page are preloaded.
const gelasio = Gelasio({
  variable: "--font-gelasio",
  subsets: ["latin"],
  display: "swap",
});

const gelasioItalic = Gelasio({
  variable: "--font-gelasio-italic",
  subsets: ["latin"],
  style: "italic",
  display: "swap",
  preload: false,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: site.name,
    url: "/",
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${gelasio.variable} ${gelasioItalic.variable} ${inter.variable} ${montserrat.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
