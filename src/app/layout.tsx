import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#02120d",
};

export const metadata: Metadata = {
  title: "Vecar Perfumería • Perfumería de Autor & Vecar Club | Cochabamba",
  description:
    "Catálogo exclusivo de perfumería de autor, fragancias árabes de tendencia en 50 ml y programa de fidelidad Vecar Club en Cochabamba, Bolivia. Ubicación: Av. Heroínas entre Av. Oquendo y Calle 16 de Julio.",
  keywords: [
    "Perfumería Cochabamba",
    "Vecar Perfumería",
    "Perfumes Árabes Bolivia",
    "Fragancias de autor",
    "Lattafa Bolivia",
    "Armaf Cochabamba",
    "Vecar Club fidelidad",
    "Perfumes 50ml",
  ],
  authors: [{ name: "Vecar Perfumería" }],
  openGraph: {
    title: "Vecar Perfumería • Fragancias de Autor y Club de Fidelidad",
    description: "Encuentra la fragancia que define tu esencia. 10 sellos = 1 perfume de 50ml gratis en Cochabamba.",
    url: "https://vecarperfumeria.bo",
    siteName: "Vecar Perfumería",
    images: [
      {
        url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Vecar Perfumería Cochabamba",
      },
    ],
    locale: "es_BO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark scroll-smooth">
      <body className="antialiased selection:bg-gold-500 selection:text-emerald-950">
        {children}
      </body>
    </html>
  );
}
