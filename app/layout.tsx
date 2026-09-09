import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diamante MX | Béisbol en vivo",
  description: "Marcadores, posiciones y líderes de béisbol en un solo lugar.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
