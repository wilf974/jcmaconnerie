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
                    <Link href="/admin" className="nav-link">Dashboard</Link>
                    <Link href="/admin/logo" className="nav-link">Logo</Link>
                    <Link href="/admin/accueil" className="nav-link">Page d'Accueil</Link>
                    <Link href="/admin/footer" className="nav-link">Pied de Page</Link>
                    <Link href="/admin/services" className="nav-link">Services</Link>
                    <Link href="/admin/realisations" className="nav-link">Réalisations</Link>
                    <Link href="/admin/avant-apres" className="nav-link">Avant/Après</Link>
                    <Link href="/admin/temoignages" className="nav-link">Témoignages</Link>
                    <Link href="/admin/messages" className="nav-link">Messages</Link>
                    <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                        <Link href="/" className="nav-link" style={{ color: 'var(--color-accent)' }}>Retour au site</Link>
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
