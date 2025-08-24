import "../global.css";
import { Inter } from "@next/font/google";
import LocalFont from "@next/font/local";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: {
    default: "jagritnokwal.com",
    template: "%s | jagritnokwal.com",
  },
  description: "Jagrit Nokwal",
  openGraph: {
    title: "jagritnokwal.com",
    description:
      "Jagrit Nokwal",
    url: "https://jagritnokwal.com",
    siteName: "jagritnokwal.com",
    images: [
      {
        url: "https://jagritnokwal.com/og.png",
        width: 1920,
        height: 1080,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "jagrit Nokwal",
    card: "summary_large_image",
  },
  icons: {
    shortcut: "/favicon.png",
  },
  appleWebApp: {
    title: 'jagritnokwal.com',
    statusBarStyle: 'black-translucent',
  },
};
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const calSans = LocalFont({
  src: "../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={[inter.variable, calSans.variable].join(" ")}>
      <head>
        <Analytics />
      </head>
      <body
        className={`bg-black ${process.env.NODE_ENV === "development" ? "debug-screens" : undefined}`}
      >
        {children}
      </body>
    </html>
  );
}
