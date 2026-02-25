import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Navbar from "@/components/NavBar";
import { Suspense } from "react";
import Providers from "./providers";

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "DailyMovIt",
  description: "Your dose of workout. Everyday. Everywhere.",
};

const montserratSans = Montserrat({
  variable: "--font-montserrat-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserratSans.className} antialiased`}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Suspense fallback={null}>
              <Navbar>{children}</Navbar>
            </Suspense>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
