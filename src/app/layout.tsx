import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JC Maçonnerie - Expert en Construction et Rénovation",
  description: "JC Maçonnerie, votre partenaire de confiance pour tous travaux de maçonnerie, rénovation et aménagements extérieurs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
}
