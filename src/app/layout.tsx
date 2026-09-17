import type { Metadata } from "next";
import "./globals.css";

import { MotionProvider } from "@/components/provider/motion-provider";

export const metadata: Metadata = {
  title: "TripLedger",
  description:
    "Group trip contribution and expense tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MotionProvider>
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}