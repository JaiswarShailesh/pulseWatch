import type { Metadata } from "next";
import { Syne, DM_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PulseWatch — Website Monitoring",
  description: "Monitor your websites, SSL certificates, and domain expiry in real-time.",
  // Prevent search engines from indexing the app (it's behind auth)
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmMono.variable}`}>
      <body className="bg-bg text-text font-sans antialiased">
        <ErrorBoundary>
          <AppProvider>{children}</AppProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
