import Link from 'next/link'
import { prisma } from "@/lib/prisma"
import BeforeAfterSlider from '@/components/BeforeAfterSlider'

export const dynamic = 'force-dynamic'

export default async function Home() {
    const beforeAfterItems = await prisma.beforeAfter.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3 // Limit to 3 items on homepage
    })

    const testimonials = await prisma.testimonial.findMany({
        where: { approved: true },
        orderBy: { createdAt: 'desc' },
        take: 3
    })

    const config = await prisma.homepageConfig.findFirst() || {
        heroTitle: "L'Art de la Maçonnerie Premium",
        heroSubtitle: "Expertise, précision et qualité pour tous vos projets de construction et de rénovation.",
        heroButtonText: "Demander un devis",
        heroButtonLink: "/contact",
        heroButton2Text: "Voir nos réalisations",
        heroButton2Link: "/realisations"
    }

    const siteConfig = await prisma.siteConfig.findFirst()
    const logoPath = siteConfig?.logoPath || '/assets/Logo.png'

    return (
        <>
            {/* Hero Section */}
            <section style={{
                height: '85vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at center, var(--color-surface) 0%, var(--color-background) 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background Pattern */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.05,
                    backgroundImage: 'linear-gradient(var(--color-text-muted) 1px, transparent 1px), linear-gradient(90deg, var(--color-text-muted) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}></div>
                
                <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <img
                            src={logoPath}
                            alt="JC Maçonnerie Logo"
                            width={150}
                            height={150}
                            style={{ borderRadius: '50%', border: '4px solid var(--color-primary)' }}
                        />
                    </div>
                    <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
                        {config.heroTitle}
                    </h1>
                    <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem', color: 'var(--color-text-muted)' }}>
                        {config.heroSubtitle}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link href={config.heroButtonLink} className="btn btn-primary">
                            {config.heroButtonText}
                        </Link>
                        <Link href={config.heroButton2Link} className="btn btn-outline">
                            {config.heroButton2Text}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Before/After Section */}
            {beforeAfterItems.length > 0 && (
                <section className="section" style={{ background: 'var(--color-surface)' }}>
                    <div className="container">
                        <h2 className="text-center mb-md">Métamorphoses</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                            {beforeAfterItems.map((item: typeof beforeAfterItems[0]) => (
                                <BeforeAfterSlider 
                                    key={item.id}
                                    title={item.title}
                                    beforeImage={item.beforeImage}
                                    afterImage={item.afterImage}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Services Preview */}
            <section className="section">
                <div className="container">
                    <h2 className="text-center mb-md">Nos Services</h2>
                    <div className="grid grid-cols-3">
                        <div className="card">
                            <h3>Construction Neuve</h3>
                            <p>Réalisation de maisons individuelles et bâtiments avec des matériaux de qualité.</p>
                        </div>
                        <div className="card">
                            <h3>Rénovation</h3>
                            <p>Transformation et restauration de bâtiments anciens pour leur donner une seconde vie.</p>
                        </div>
                        <div className="card">
                            <h3>Aménagements Extérieurs</h3>
                            <p>Création de terrasses, murets et allées pour sublimer votre extérieur.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            {testimonials.length > 0 && (
                <section className="section" style={{ background: 'var(--color-surface)' }}>
                    <div className="container">
                        <h2 className="text-center mb-md">Ce que disent nos clients</h2>
                        <div className="grid grid-cols-3">
                            {testimonials.map((testimonial: typeof testimonials[0]) => (
                                <div key={testimonial.id} className="card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <h4 style={{ margin: 0 }}>{testimonial.name}</h4>
                                        <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>
                                            {'★'.repeat(testimonial.rating)}
                                        </span>
                                    </div>
                                    <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>
                                        "{testimonial.content}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}
