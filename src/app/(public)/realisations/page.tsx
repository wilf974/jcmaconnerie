import { prisma } from "@/lib/prisma"
import Image from "next/image"

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <main className="section">
      <div className="container">
        <h1 className="text-center mb-md">Nos Réalisations</h1>
        
        {projects.length === 0 ? (
          <p className="text-center">Aucune réalisation n'a été publiée pour le moment.</p>
        ) : (
          <div className="grid grid-cols-3">
            {projects.map((project: typeof projects[0]) => (
              <div key={project.id} className="card">
                <div style={{ position: 'relative', height: '250px', marginBottom: '1rem' }}>
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    style={{ objectFit: 'cover', borderRadius: '0.5rem' }}
                  />
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

