import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "@/components/providers/session-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MAP Data Visualization Tool - NextGen Academy",
  description: "Generate compelling visualizations from MAP test data to demonstrate tutoring value",
  keywords: ["MAP", "visualization", "tutoring", "NextGen Academy", "academic progress"],
  authors: [{ name: "NextGen Academy" }],
  creator: "NextGen Academy",
  publisher: "NextGen Academy",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
