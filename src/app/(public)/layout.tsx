import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Navbar />
            <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1 }}>{children}</div>
            </main>
            <Footer />
        </>
    )
}
