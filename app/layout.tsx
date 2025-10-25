import "./globals.css";
import type { Metadata } from "next";
import { TopLeftHome } from "@/components/TopLeftHome";

export const metadata: Metadata = {
  title: "GAIA",
  description: "GAIA v1.3 — Intro",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <TopLeftHome />
        {children}
      </body>
    </html>
  );
}
