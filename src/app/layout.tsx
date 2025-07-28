import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Lexend } from "next/font/google";
import { OfflineIndicator } from "./(components)/offline-indicator";
import { PWAInstallPrompt } from "./(components)/pwa-install-prompt";
import { ServiceWorkerRegister } from "./(components)/service-worker-register";
import { Contexts } from "./(contexts)";

import "./globals.css";

const LexendFont = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Moneyly - Financeiro",
  description: "Aplicativo de gestão financeira pessoal",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Moneyly",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
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
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="Moneyly" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Moneyly" />
        <meta name="description" content="Aplicativo de gestão financeira pessoal" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icon-192x192.png" color="#000000" />
        <link rel="shortcut icon" href="/icon-192x192.png" />
      </head>
      <body className={cn("antialiased bg-background text-foreground", LexendFont.className)} suppressHydrationWarning>
        <Contexts>
          <ServiceWorkerRegister />
          <OfflineIndicator />
          {children}
          <Toaster richColors position="bottom-center" />
          <Analytics />
          <PWAInstallPrompt />
        </Contexts>
      </body>
    </html>
  );
}
