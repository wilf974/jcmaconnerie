import { prisma } from "@/lib/prisma"
import ReviewForm from "@/components/ReviewForm"

export const dynamic = 'force-dynamic'

export default async function ReviewsPage() {
    const approvedTestimonials = await prisma.testimonial.findMany({
        where: { approved: true },
        orderBy: { createdAt: 'desc' }
    })

    async function submitReview(formData: FormData) {
        'use server'
        const name = formData.get('name') as string
        const content = formData.get('content') as string
        const rating = parseInt(formData.get('rating') as string)

        if (!name || !content || isNaN(rating)) {
            throw new Error('Tous les champs sont requis')
        }

        await prisma.testimonial.create({
            data: {
                name,
                content,
                rating,
                approved: false
            }
        })
    }

    return (
        <main className="section">
            <div className="container">
                <h1 className="text-center mb-md">Avis Clients</h1>

                {/* Submission Form */}
                <ReviewForm submitReview={submitReview} />

                {/* Reviews List */}
                {approvedTestimonials.length === 0 ? (
                    <p className="text-center">Aucun avis publié pour le moment.</p>
                ) : (
                    <div className="grid grid-cols-3">
                        {approvedTestimonials.map((review: typeof approvedTestimonials[0]) => (
                            <div key={review.id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h4 style={{ margin: 0 }}>{review.name}</h4>
                                    <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>
                                        {'★'.repeat(review.rating)}
                                        <span style={{ opacity: 0.3 }}>{'★'.repeat(5 - review.rating)}</span>
                                    </span>
                                </div>
                                <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>
                                    "{review.content}"
                                </p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '1rem', textAlign: 'right' }}>
                                    Le {review.createdAt.toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}
