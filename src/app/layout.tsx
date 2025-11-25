import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: {
        default: "JC Maçonnerie - Expert en Construction et Rénovation",
        template: "%s | JC Maçonnerie"
    },
    description: "JC Maçonnerie, votre partenaire de confiance pour tous travaux de maçonnerie, rénovation et aménagements extérieurs à Bordeaux et alentours.",
    keywords: ["maçonnerie", "rénovation", "construction", "Bordeaux", "travaux", "aménagement extérieur", "terrasse", "muret"],
    authors: [{ name: "JC Maçonnerie" }],
    openGraph: {
        type: "website",
        locale: "fr_FR",
        siteName: "JC Maçonnerie",
        title: "JC Maçonnerie - Expert en Construction et Rénovation",
        description: "Votre partenaire de confiance pour tous travaux de maçonnerie, rénovation et aménagements extérieurs.",
    },
    twitter: {
        card: "summary_large_image",
        title: "JC Maçonnerie - Expert en Construction et Rénovation",
        description: "Votre partenaire de confiance pour tous travaux de maçonnerie.",
    },
    robots: {
        index: true,
        follow: true,
    },
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
