import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    const [messageCount, projectCount, testimonialCount] = await Promise.all([
        prisma.contactMessage.count(),
        prisma.project.count(),
        prisma.testimonial.count()
    ])

    return (
        <div>
            <h1>Tableau de bord</h1>
            <div className="grid grid-cols-3">
                <div className="card">
                    <h3>Messages</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{messageCount}</p>
                    <p>Nouveaux messages</p>
                </div>
                <div className="card">
                    <h3>Réalisations</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{projectCount}</p>
                    <p>Projets publiés</p>
                </div>
                <div className="card">
                    <h3>Avis</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{testimonialCount}</p>
                    <p>Avis clients</p>
                </div>
            </div>
        </div>
    )
}
