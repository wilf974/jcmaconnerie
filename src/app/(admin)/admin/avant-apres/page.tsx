import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { saveFile } from "@/lib/upload"

export default async function BeforeAfterAdminPage() {
    const items = await prisma.beforeAfter.findMany({
        orderBy: { createdAt: 'desc' }
    })

    async function addItem(formData: FormData) {
        'use server'
        const title = formData.get('title') as string
        const beforeImageFile = formData.get('beforeImage') as File
        const afterImageFile = formData.get('afterImage') as File

        if (!title || !beforeImageFile || !afterImageFile) return

        const beforeImageUrl = await saveFile(beforeImageFile)
        const afterImageUrl = await saveFile(afterImageFile)

        await prisma.beforeAfter.create({
            data: { 
                title, 
                beforeImage: beforeImageUrl, 
                afterImage: afterImageUrl 
            }
        })
        revalidatePath('/admin/avant-apres')
        revalidatePath('/')
    }

    async function deleteItem(formData: FormData) {
        'use server'
        const id = formData.get('id') as string
        if (!id) return

        await prisma.beforeAfter.delete({ where: { id } })
        revalidatePath('/admin/avant-apres')
        revalidatePath('/')
    }

    return (
        <div>
            <h1>Gérer Avant/Après</h1>
            
            {/* Add Form */}
            <div className="card mb-md" style={{ marginBottom: '2rem' }}>
                <h3>Ajouter une nouvelle comparaison</h3>
                <form action={addItem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Titre</label>
                        <input type="text" name="title" required style={{ width: '100%', padding: '0.5rem' }} placeholder="Ex: Rénovation Façade" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Image Avant</label>
                            <input type="file" name="beforeImage" required accept="image/*" style={{ width: '100%', padding: '0.5rem' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Image Après</label>
                            <input type="file" name="afterImage" required accept="image/*" style={{ width: '100%', padding: '0.5rem' }} />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Ajouter</button>
                </form>
            </div>

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
