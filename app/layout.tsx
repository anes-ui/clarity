import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wealthsimple Clarity",
  description: "Your financial picture. Fully understood.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-ws-surface-0 text-ws-text-primary">
        {children}
      </body>
    </html>
  );
}
