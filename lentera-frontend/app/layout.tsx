import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "@/components/ClientProviders";


export const metadata: Metadata = {
  title: "LENTERA — Lab Asset Management System",
  description: "Sistem Peminjaman Aset Laboratorium",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className="h-full antialiased"
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
