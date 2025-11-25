import { prisma } from "@/lib/prisma"
import Image from "next/image"
import { Metadata } from "next"
import ImageGallery from "@/components/ImageGallery"

export const metadata: Metadata = {
    title: "Nos Réalisations",
    description: "Découvrez nos projets de maçonnerie, rénovation et construction. Galerie de nos réalisations avant/après.",
}

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
        include: { images: true }
    })

    return (
        <main className="section">
            <div className="container">
                <h1 className="text-center mb-md">Nos Réalisations</h1>
                
                {projects.length === 0 ? (
                    <p className="text-center">Aucune réalisation n'a été publiée pour le moment.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        {projects.map((project) => (
                            <div key={project.id} className="card" style={{ overflow: 'hidden' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: project.images.length > 0 ? '1fr 1fr' : '1fr', gap: '2rem' }}>
                                    {/* Image principale ou galerie */}
                                    <div>
                                        {project.images.length > 0 ? (
                                            <ImageGallery 
                                                images={project.images}
                                                mainImage={project.imageUrl}
                                                title={project.title}
                                            />
                                        ) : (
                                            <div style={{ position: 'relative', paddingBottom: '75%', borderRadius: '0.5rem', overflow: 'hidden' }}>
                                                <Image
                                                    src={project.imageUrl}
                                                    alt={project.title}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Contenu */}
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <h2 style={{ marginBottom: '1rem' }}>{project.title}</h2>
                                        <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.8' }}>
                                            {project.description}
                                        </p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '1rem' }}>
                                            Réalisé le {project.createdAt.toLocaleDateString('fr-FR', { 
                                                year: 'numeric', 
                                                month: 'long' 
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}
