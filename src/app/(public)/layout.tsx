import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getLogoPath() {
    try {
        const config = await prisma.siteConfig.findFirst()
        return config?.logoPath || '/assets/Logo.png'
    } catch {
        return '/assets/Logo.png'
    }
}

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const logoPath = await getLogoPath()

    return (
        <>
            <Navbar logoPath={logoPath} />
            <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1 }}>{children}</div>
            </main>
            <Footer />
        </>
    )
}
