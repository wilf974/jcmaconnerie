import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export const dynamic = 'force-dynamic'

export default async function TestimonialsAdminPage() {
    const testimonials = await prisma.testimonial.findMany({
        orderBy: { createdAt: 'desc' }
    })

    async function addTestimonial(formData: FormData) {
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
                approved: true // Manually added by admin are auto-approved
            }
        })
        revalidatePath('/admin/temoignages')
        revalidatePath('/')
        revalidatePath('/avis')
    }

    async function deleteTestimonial(formData: FormData) {
        'use server'
        const id = formData.get('id') as string
        if (!id) return

        await prisma.testimonial.delete({ where: { id } })
        revalidatePath('/admin/temoignages')
        revalidatePath('/')
        revalidatePath('/avis')
    }

    async function toggleApproval(formData: FormData) {
        'use server'
        const id = formData.get('id') as string
        const currentStatus = formData.get('currentStatus') === 'true'
        
        if (!id) return

        await prisma.testimonial.update({
            where: { id },
            data: { approved: !currentStatus }
        })
        revalidatePath('/admin/temoignages')
        revalidatePath('/')
        revalidatePath('/avis')
    }

    return (
        <div>
            <h1>Gérer les Témoignages</h1>
            
            {/* Add Form */}
            <div className="card mb-md" style={{ marginBottom: '2rem' }}>
                <h3>Ajouter un avis (Manuellement)</h3>
                <form action={addTestimonial} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nom du client</label>
                            <input type="text" name="name" required style={{ width: '100%', padding: '0.5rem' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Note / 5</label>
                            <select name="rating" style={{ width: '100%', padding: '0.5rem' }} defaultValue="5">
                                <option value="5">5 - Excellent</option>
                                <option value="4">4 - Très bien</option>
                                <option value="3">3 - Bien</option>
                                <option value="2">2 - Moyen</option>
                                <option value="1">1 - Mauvais</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Commentaire</label>
                        <textarea name="content" required rows={3} style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    <button type="submit" className="btn btn-primary">Ajouter & Publier</button>
                </form>
            </div>

            {/* List */}
            <div className="grid grid-cols-3">
                {testimonials.map(review => (
                    <div key={review.id} className="card" style={{ borderLeft: review.approved ? '4px solid green' : '4px solid orange' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <h4 style={{ margin: 0 }}>{review.name}</h4>
                            <span style={{ 
                                background: review.approved ? 'green' : 'orange', 
                                color: 'white', 
                                padding: '0.2rem 0.5rem', 
                                borderRadius: '0.25rem', 
                                fontSize: '0.7rem' 
                            }}>
                                {review.approved ? 'PUBLIÉ' : 'EN ATTENTE'}
                            </span>
                        </div>
                        <div style={{ marginBottom: '0.5rem', color: 'var(--color-accent)' }}>
                            {'★'.repeat(review.rating)}
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem', fontStyle: 'italic' }}>"{review.content}"</p>
                        
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <form action={toggleApproval} style={{ flex: 1 }}>
                                <input type="hidden" name="id" value={review.id} />
                                <input type="hidden" name="currentStatus" value={String(review.approved)} />
                                <button type="submit" className="btn" style={{ 
                                    width: '100%', 
                                    background: review.approved ? 'var(--color-secondary)' : 'green',
                                    color: 'white',
                                    fontSize: '0.9rem'
                                }}>
                                    {review.approved ? 'Masquer' : 'Approuver'}
                                </button>
                            </form>
                            <form action={deleteTestimonial} style={{ flex: 1 }}>
                                <input type="hidden" name="id" value={review.id} />
                                <button type="submit" className="btn btn-outline" style={{ borderColor: 'red', color: 'red', width: '100%', fontSize: '0.9rem' }}>
                                    Supprimer
                                </button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
