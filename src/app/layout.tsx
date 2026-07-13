import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kenol Flock ChMS – Church Management Platform",
  description: "Modern, powerful Church Administration System with real-time cloud, Moolre POS giving, SMS Broadcasting, and congregation management for Kenol Flock International.",
  keywords: ["church management", "ChMS", "Kenol Flock", "congregation", "Moolre", "giving", "tithes", "church software"],
  authors: [{ name: "Kenol Flock International" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KenolFlock ChMS",
  },
  openGraph: {
    title: "Kenol Flock ChMS – Church Management Platform",
    description: "Powerful, real-time church administration: members, giving, events, SMS and analytics.",
    type: "website",
    locale: "en_GH",
    siteName: "Kenol Flock International",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kenol Flock ChMS",
    description: "Modern church management with real-time cloud sync, Moolre giving & SMS broadcasting.",
  },
};

export const viewport: Viewport = {
  themeColor: "#FF5A43",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
