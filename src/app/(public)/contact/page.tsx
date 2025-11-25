import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import ContactForm from "@/components/ContactForm"

export const dynamic = 'force-dynamic'

export default function ContactPage() {
    async function submitContact(formData: FormData) {
        'use server'
        
        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const message = formData.get('message') as string

        if (!name || !email || !message) {
            throw new Error('Tous les champs sont requis')
        }

        await prisma.contactMessage.create({
            data: { name, email, message }
        })

        revalidatePath('/admin/messages')
    }

    return (
        <main className="section">
            <div className="container">
                <h1 className="text-center mb-md">Contactez-nous</h1>
                <p className="text-center" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
                    Vous avez un projet ? Une question ? N'hésitez pas à nous contacter, 
                    nous vous répondrons dans les plus brefs délais.
                </p>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <ContactForm submitContact={submitContact} />
                </div>
            </div>
        </main>
    )
}
