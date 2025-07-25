import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import { Contexts } from "./(contexts)";

import "./globals.css";

const LexendFont = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Moneyly - Financeiro",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased bg-background text-foreground", LexendFont.className)} suppressHydrationWarning>
        <Contexts>
          {children}
          <Toaster richColors position="bottom-center" />
          <Analytics />
        </Contexts>
      </body>
    </html>
  );
}
