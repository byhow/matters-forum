import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import { AxiomWebVitals } from "next-axiom";

export const metadata: Metadata = {
  openGraph: {
    title: "Matters Forum",
    url: "https://matters-forum.vercel.app",
    siteName: "Matters Forum",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AxiomWebVitals />
      <body>
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  );
}
