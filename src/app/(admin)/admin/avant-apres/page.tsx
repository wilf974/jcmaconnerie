import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import BeforeAfterForm from "@/components/BeforeAfterForm"

export const dynamic = 'force-dynamic'

export default async function BeforeAfterAdminPage() {
    const items = await prisma.beforeAfter.findMany({
        orderBy: { createdAt: 'desc' }
    })

    async function addItem(formData: FormData) {
        'use server'
        try {
            const title = formData.get('title') as string
            const beforeImageUrl = formData.get('beforeImageUrl') as string
            const afterImageUrl = formData.get('afterImageUrl') as string

            if (!title || !beforeImageUrl || !afterImageUrl) {
                throw new Error('Tous les champs sont requis')
            }

            await prisma.beforeAfter.create({
                data: { 
                    title, 
                    beforeImage: beforeImageUrl, 
                    afterImage: afterImageUrl 
                }
            })
            
            revalidatePath('/admin/avant-apres')
            revalidatePath('/')
        } catch (error) {
            console.error('Erreur lors de l\'ajout:', error)
            throw error instanceof Error ? error : new Error('Erreur lors de l\'ajout de la comparaison')
        }
    }

    async function deleteItem(formData: FormData) {
        'use server'
        try {
            const id = formData.get('id') as string
            if (!id) {
                throw new Error('ID manquant')
            }

            await prisma.beforeAfter.delete({ where: { id } })
            revalidatePath('/admin/avant-apres')
            revalidatePath('/')
        } catch (error) {
            console.error('Erreur lors de la suppression:', error)
            throw error
        }
    }

    return (
        <div>
            <h1>Gérer Avant/Après</h1>
            
            {/* Add Form */}
            <BeforeAfterForm addItem={addItem} />

            {/* List */}
            <div className="grid grid-cols-3">
                {items.map((item: typeof items[0]) => (
                    <div key={item.id} className="card">
                        <h4>{item.title}</h4>
                        <div style={{ display: 'flex', gap: '0.5rem', margin: '1rem 0' }}>
                            <img src={item.beforeImage} alt="Avant" style={{ width: '50%', height: '100px', objectFit: 'cover' }} />
                            <img src={item.afterImage} alt="Après" style={{ width: '50%', height: '100px', objectFit: 'cover' }} />
                        </div>
                        <form action={deleteItem}>
                            <input type="hidden" name="id" value={item.id} />
                            <button type="submit" className="btn btn-outline" style={{ borderColor: 'red', color: 'red', width: '100%' }}>
                                Supprimer
                            </button>
                        </form>
                    </div>
                ))}
            </div>
        </div>
    )
}
