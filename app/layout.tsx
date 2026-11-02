import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diamante MX | Béisbol en vivo",
  description: "Marcadores, posiciones y líderes de béisbol en un solo lugar.",
  applicationName: "Diamante MX",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/diamante-mx-192.png",
    apple: "/diamante-mx-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#07110d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
