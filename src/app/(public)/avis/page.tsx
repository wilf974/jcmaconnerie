import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

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

        if (!name || !content || isNaN(rating)) return

        await prisma.testimonial.create({
            data: {
                name,
                content,
                rating,
                approved: false // Pending approval
            }
        })
    }

    return (
        <main className="section">
            <div className="container">
                <h1 className="text-center mb-md">Avis Clients</h1>

                {/* Submission Form */}
                <div className="card mb-md" style={{ maxWidth: '600px', margin: '0 auto 4rem' }}>
                    <h3 className="text-center mb-sm">Donner votre avis</h3>
                    <p className="text-center mb-md" style={{ fontSize: '0.9rem' }}>
                        Votre avis compte pour nous ! Il sera publié après modération.
                    </p>
                    <form action={submitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Votre nom</label>
                                <input type="text" name="name" required style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Note</label>
                                <select name="rating" style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} defaultValue="5">
                                    <option value="5">★★★★★ (Excellent)</option>
                                    <option value="4">★★★★☆ (Très bien)</option>
                                    <option value="3">★★★☆☆ (Bien)</option>
                                    <option value="2">★★☆☆☆ (Moyen)</option>
                                    <option value="1">★☆☆☆☆ (Déçu)</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Votre message</label>
                            <textarea name="content" required rows={4} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }}></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Envoyer mon avis</button>
                    </form>
                </div>

                {/* Reviews List */}
                {approvedTestimonials.length === 0 ? (
                    <p className="text-center">Aucun avis publié pour le moment.</p>
                ) : (
                    <div className="grid grid-cols-3">
                        {approvedTestimonials.map((review) => (
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

