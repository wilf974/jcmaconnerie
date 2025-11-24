import Link from 'next/link'
import { prisma } from "@/lib/prisma"

export default async function Footer() {
    const config = await prisma.footerConfig.findFirst() || {
        companyDescription: "Expertise et savoir-faire pour tous vos projets de construction et rénovation. Qualité et satisfaction client sont nos priorités.",
        phone: "06 12 34 56 78",
        email: "contact@jc-maconnerie.fr",
        address: "Bordeaux et alentours"
    }

    return (
        <footer style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', paddingTop: '4rem', paddingBottom: '2rem', marginTop: 'auto' }}>
            <div className="container">
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                    
                    {/* Company Info */}
                    <div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>JC Maçonnerie</h3>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                            {config.companyDescription}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ marginBottom: '1rem' }}>Navigation</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li><Link href="/" className="nav-link">Accueil</Link></li>
                            <li><Link href="/services" className="nav-link">Services</Link></li>
                            <li><Link href="/realisations" className="nav-link">Réalisations</Link></li>
                            <li><Link href="/contact" className="nav-link">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 style={{ marginBottom: '1rem' }}>Contact</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                {config.phone}
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                {config.email}
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                {config.address}
                            </li>
                        </ul>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    <p>&copy; {new Date().getFullYear()} JC Maçonnerie. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    )
}
