import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sleek URL",
  description: "Make your URL short and sweet!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <div className="flex flex-row max-w-screen-2xl mx-auto py-10 px-4 border-b">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
            Sleek URL
          </h1>
        </div>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
