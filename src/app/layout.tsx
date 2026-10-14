import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PwaRegister } from "@/components/shared/pwa-register";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: { default: "StampKaro | Digital Loyalty Rewards", template: "%s | StampKaro" },
  description: "Har visit pe stamp, har stamp pe reward. QR-based loyalty rewards for local businesses.",
  applicationName: "StampKaro",
  keywords: ["digital loyalty card", "QR loyalty", "customer rewards", "local business loyalty"],
  openGraph: {
    type: "website",
    siteName: "StampKaro",
    title: "StampKaro | Digital Loyalty Rewards",
    description: "Har visit pe stamp, har stamp pe reward.",
  },
  twitter: { card: "summary_large_image", title: "StampKaro", description: "Har visit pe stamp, har stamp pe reward." },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${plusJakartaSans.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
        <Toaster richColors position="top-center" />
        <PwaRegister />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
