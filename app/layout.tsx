import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Prototype Designer | Build Better APIs",
  description: "A powerful visual tool for designing, testing, and managing API prompts and specifications.",
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased h-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white`} suppressHydrationWarning>
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  );
}
