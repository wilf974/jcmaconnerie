import Link from 'next/link'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside style={{
                width: '250px',
                background: 'var(--color-surface)',
                borderRight: '1px solid var(--color-border)',
                padding: '2rem 1rem'
            }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem' }}>JC Admin</h2>
                </div>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link href="/admin" style={{ color: 'var(--color-text)', fontWeight: 600 }}>Dashboard</Link>
                    <Link href="/admin/logo" style={{ color: 'var(--color-text)', fontWeight: 600 }}>Logo</Link>
                    <Link href="/admin/accueil" style={{ color: 'var(--color-text)', fontWeight: 600 }}>Page d'Accueil</Link>
                    <Link href="/admin/footer" style={{ color: 'var(--color-text)', fontWeight: 600 }}>Pied de Page</Link>
                    <Link href="/admin/services" style={{ color: 'var(--color-text)', fontWeight: 600 }}>Services</Link>
                    <Link href="/admin/realisations" style={{ color: 'var(--color-text)', fontWeight: 600 }}>Réalisations</Link>
                    <Link href="/admin/avant-apres" style={{ color: 'var(--color-text)', fontWeight: 600 }}>Avant/Après</Link>
                    <Link href="/admin/temoignages" style={{ color: 'var(--color-text)', fontWeight: 600 }}>Témoignages</Link>
                    <Link href="/admin/messages" style={{ color: 'var(--color-text)', fontWeight: 600 }}>Messages</Link>
                    <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                        <Link href="/" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Retour au site</Link>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem' }}>
                {children}
            </main>
        </div>
    )
}
