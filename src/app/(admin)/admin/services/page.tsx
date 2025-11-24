import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { saveFile } from "@/lib/upload"

export default async function ServicesAdminPage() {
    const services = await prisma.service.findMany({
        orderBy: { createdAt: 'desc' }
    })

    async function addService(formData: FormData) {
        'use server'
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const imageFile = formData.get('image') as File

        if (!title || !description) return

        let imageUrl = null
        if (imageFile && imageFile.size > 0) {
            imageUrl = await saveFile(imageFile)
        }

        await prisma.service.create({
            data: {
                title,
                description,
                imageUrl
            }
        })
        revalidatePath('/admin/services')
        revalidatePath('/services')
        revalidatePath('/')
    }

    async function deleteService(formData: FormData) {
        'use server'
        const id = formData.get('id') as string
        if (!id) return

        await prisma.service.delete({ where: { id } })
        revalidatePath('/admin/services')
        revalidatePath('/services')
        revalidatePath('/')
    }

    return (
        <div>
            <h1>Gérer les Services</h1>
            
            {/* Add Form */}
            <div className="card mb-md" style={{ marginBottom: '2rem' }}>
                <h3>Ajouter un nouveau service</h3>
                <form action={addService} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Titre</label>
                        <input type="text" name="title" required style={{ width: '100%', padding: '0.5rem' }} placeholder="Ex: Maçonnerie Générale" />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                        <textarea name="description" required rows={3} style={{ width: '100%', padding: '0.5rem' }} placeholder="Description détaillée du service..." />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Image (Optionnel)</label>
                        <input type="file" name="image" accept="image/*" style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    <button type="submit" className="btn btn-primary">Ajouter</button>
                </form>
            </div>

            {/* List */}
            <div className="grid grid-cols-3">
                {services.map(service => (
                    <div key={service.id} className="card">
                        {service.imageUrl && (
                            <div style={{ marginBottom: '1rem' }}>
                                <img src={service.imageUrl} alt={service.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '0.25rem' }} />
                            </div>
                        )}
                        <h4>{service.title}</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>{service.description}</p>
                        <form action={deleteService}>
                            <input type="hidden" name="id" value={service.id} />
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

