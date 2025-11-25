import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import ProjectForm from "@/components/ProjectForm"
import Image from "next/image"

export const dynamic = 'force-dynamic'

export default async function ProjectsAdminPage() {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
        include: { images: true }
    })

    async function addProject(formData: FormData) {
        'use server'
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const imageUrl = formData.get('imageUrl') as string
        const additionalImagesJson = formData.get('additionalImages') as string

        if (!title || !description || !imageUrl) {
            throw new Error('Tous les champs sont requis')
        }

        const additionalImages: string[] = additionalImagesJson ? JSON.parse(additionalImagesJson) : []

        await prisma.project.create({
            data: {
                title,
                description,
                imageUrl,
                images: {
                    create: additionalImages.map(url => ({ url }))
                }
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
            
            <ProjectForm addProject={addProject} />

            {/* List */}
            <div className="grid grid-cols-3">
                {projects.map((project) => (
                    <div key={project.id} className="card">
                        <div style={{ marginBottom: '1rem', position: 'relative', height: '200px' }}>
                            <Image 
                                src={project.imageUrl} 
                                alt={project.title} 
                                fill
                                style={{ objectFit: 'cover', borderRadius: '0.25rem' }} 
                            />
                        </div>
                        <h4>{project.title}</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                            {project.description}
                        </p>
                        {project.images.length > 0 && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                                📷 {project.images.length + 1} photo{project.images.length > 0 ? 's' : ''}
                            </p>
                        )}
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
