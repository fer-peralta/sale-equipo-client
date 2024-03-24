import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./styles/style.css"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sale equipo web client",
  description: "Web client for Sale equipo app. This aplicaction matches players of football to play.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <nav>
          <ul>
            <li><a href="./">Inicio</a></li>
            <li><a href="./">Ayuda</a></li>
            <li><a href="./">Configuración</a></li>
          </ul>
        </nav>

        {children}
      </body>
    </html>
  );
}
