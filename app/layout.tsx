import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { PasswordGate } from "./components/PasswordGate";
import { ToastProvider } from "./components/Toast";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: "Boys Trip 2026",
  description: "Get to know your fellow travelers!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${instrumentSerif.variable}`}>
      <body className="font-sans">
        <ConvexClientProvider>
          <ToastProvider>
            <PasswordGate>{children}</PasswordGate>
          </ToastProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
