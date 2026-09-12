import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PersonProvider } from "@/lib/person-context";
import { IdentityGate } from "@/components/IdentityGate";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Family Hub",
  description: "Shared to-dos, reminders, and grocery list",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Family Hub",
  },
};

export const viewport: Viewport = {
  themeColor: "#f43f5e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PersonProvider>
          <IdentityGate>{children}</IdentityGate>
        </PersonProvider>
      </body>
    </html>
  );
}
