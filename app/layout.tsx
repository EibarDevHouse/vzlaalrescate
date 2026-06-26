import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vzla Al Rescate - Busca Desaparecidos",
  description:
    "Plataforma para reportar y buscar personas desaparecidas tras emergencias en Venezuela",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`scroll-smooth ${inter.variable}`}>
      <body className={`min-h-screen flex flex-col bg-white font-sans`}>{children}</body>
    </html>
  );
}
