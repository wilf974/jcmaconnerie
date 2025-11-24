import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { saveFile } from "@/lib/upload"

export default async function ProjectsAdminPage() {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' }
    })

    async function addProject(formData: FormData) {
        'use server'
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const imageFile = formData.get('image') as File

        if (!title || !description || !imageFile || imageFile.size === 0) return

        const imageUrl = await saveFile(imageFile)

        await prisma.project.create({
            data: {
                title,
                description,
                imageUrl
            }
        })
        revalidatePath('/admin/realisations')
        revalidatePath('/realisations')
        revalidatePath('/')
    }

    async function deleteProject(formData: FormData) {
        'use server'
        const id = formData.get('id') as string
        if (!id) return

        await prisma.project.delete({ where: { id } })
        revalidatePath('/admin/realisations')
        revalidatePath('/realisations')
        revalidatePath('/')
    }

    return (
        <div>
            <h1>Gérer les Réalisations</h1>
            
            {/* Add Form */}
            <div className="card mb-md" style={{ marginBottom: '2rem' }}>
                <h3>Ajouter une nouvelle réalisation</h3>
                <form action={addProject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Titre du projet</label>
                        <input type="text" name="title" required style={{ width: '100%', padding: '0.5rem' }} placeholder="Ex: Villa Moderne à Bordeaux" />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                        <textarea name="description" required rows={3} style={{ width: '100%', padding: '0.5rem' }} placeholder="Détails du chantier..." />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Photo principale</label>
                        <input type="file" name="image" required accept="image/*" style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    <button type="submit" className="btn btn-primary">Ajouter</button>
                </form>
            </div>

            {/* List */}
            <div className="grid grid-cols-3">
                {projects.map(project => (
                    <div key={project.id} className="card">
                        <div style={{ marginBottom: '1rem' }}>
                            <img src={project.imageUrl} alt={project.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '0.25rem' }} />
                        </div>
                        <h4>{project.title}</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>{project.description}</p>
                        <form action={deleteProject}>
                            <input type="hidden" name="id" value={project.id} />
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

