import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export const dynamic = 'force-dynamic'

export default function ContactPage() {
  async function submitContact(formData: FormData) {
    'use server'
    
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const message = formData.get('message') as string

    if (!name || !email || !message) return

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        message
      }
    })

    revalidatePath('/admin')
  }

  return (
    <main className="section">
      <div className="container">
        <h1 className="text-center mb-md">Contactez-nous</h1>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <form action={submitContact} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>Nom</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  background: 'var(--color-background)', 
                  border: '1px solid var(--color-border)', 
                  color: 'var(--color-text)',
                  borderRadius: '0.25rem'
                }} 
              />
            </div>
            
            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  background: 'var(--color-background)', 
                  border: '1px solid var(--color-border)', 
                  color: 'var(--color-text)',
                  borderRadius: '0.25rem'
                }} 
              />
            </div>
            
            <div>
              <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem' }}>Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows={5} 
                required 
                style={{ 
                  width: '100%', 
                  padding: '0.5rem', 
                  background: 'var(--color-background)', 
                  border: '1px solid var(--color-border)', 
                  color: 'var(--color-text)',
                  borderRadius: '0.25rem'
                }} 
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Envoyer le message
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

