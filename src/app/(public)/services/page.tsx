import { prisma } from "@/lib/prisma"
import Image from "next/image"

export const dynamic = 'force-dynamic'

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <main className="section">
      <div className="container">
        <h1 className="text-center mb-md">Nos Services</h1>
        
        {services.length === 0 ? (
          <p className="text-center">Aucun service n'a été ajouté pour le moment.</p>
        ) : (
          <div className="grid grid-cols-3">
            {services.map((service: typeof services[0]) => (
              <div key={service.id} className="card">
                {service.imageUrl && (
                  <div style={{ position: 'relative', height: '200px', marginBottom: '1rem' }}>
                    <Image
                      src={service.imageUrl}
                      alt={service.title}
                      fill
                      style={{ objectFit: 'cover', borderRadius: '0.5rem' }}
                    />
                  </div>
                )}
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

