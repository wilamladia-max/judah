import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PayrollPH – Payroll System",
  description: "Simple payroll management system for Philippine businesses.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
