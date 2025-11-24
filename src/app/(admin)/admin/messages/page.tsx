import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export default async function MessagesAdminPage() {
    const messages = await prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' }
    })

    async function deleteMessage(formData: FormData) {
        'use server'
        const id = formData.get('id') as string
        if (!id) return

        await prisma.contactMessage.delete({ where: { id } })
        revalidatePath('/admin/messages')
        revalidatePath('/admin') // Update dashboard counts
    }

    return (
        <div>
            <h1>Messages reçus</h1>
            
            {messages.length === 0 ? (
                <p>Aucun message reçu.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {messages.map(msg => (
                        <div key={msg.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <h4 style={{ margin: 0 }}>{msg.name}</h4>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                        {msg.createdAt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <a href={`mailto:${msg.email}`} style={{ color: 'var(--color-primary)', display: 'block', marginBottom: '1rem' }}>
                                    {msg.email}
                                </a>
                                <p style={{ whiteSpace: 'pre-wrap' }}>{msg.message}</p>
                            </div>
                            <div>
                                <form action={deleteMessage}>
                                    <input type="hidden" name="id" value={msg.id} />
                                    <button type="submit" className="btn btn-outline" style={{ borderColor: 'red', color: 'red' }}>
                                        Supprimer
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

