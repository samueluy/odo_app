import type { Metadata } from "next";
import { DM_Sans, Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display"
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Odo | Cursor miles, real momentum",
  description:
    "Odo turns your cursor movement into goals, streaks, and momentum. A playful menu bar odometer for macOS.",
  metadataBase: new URL("https://odoapp.vercel.app"),
  openGraph: {
    title: "Odo",
    description: "Cursor miles, real momentum.",
    images: ["/odo_logo.png"]
  },
  icons: {
    icon: "/odo_logo.png",
    apple: "/odo_logo.png",
    shortcut: "/odo_logo.png"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${dmSans.variable}`}>{children}</body>
    </html>
  );
}
