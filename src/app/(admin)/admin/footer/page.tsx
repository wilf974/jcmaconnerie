import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export default async function FooterAdminPage() {
    const config = await prisma.footerConfig.findFirst() || {
        companyDescription: "Expertise et savoir-faire pour tous vos projets de construction et rénovation. Qualité et satisfaction client sont nos priorités.",
        phone: "06 12 34 56 78",
        email: "contact@jc-maconnerie.fr",
        address: "Bordeaux et alentours"
    }

    async function updateConfig(formData: FormData) {
        'use server'
        
        const data = {
            companyDescription: formData.get('companyDescription') as string,
            phone: formData.get('phone') as string,
            email: formData.get('email') as string,
            address: formData.get('address') as string,
        }

        const existing = await prisma.footerConfig.findFirst()
        
        if (existing) {
            await prisma.footerConfig.update({
                where: { id: existing.id },
                data
            })
        } else {
            await prisma.footerConfig.create({
                data
            })
        }

        revalidatePath('/admin/footer')
        revalidatePath('/')
    }

    return (
        <div>
            <h1>Gérer le Pied de Page (Footer)</h1>
            
            <div className="card">
                <form action={updateConfig} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description de l'entreprise</label>
                        <textarea 
                            name="companyDescription" 
                            defaultValue={config.companyDescription}
                            required 
                            rows={3}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} 
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Téléphone</label>
                            <input 
                                type="text" 
                                name="phone" 
                                defaultValue={config.phone}
                                required 
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} 
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                defaultValue={config.email}
                                required 
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} 
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Adresse / Zone d'intervention</label>
                        <input 
                            type="text" 
                            name="address" 
                            defaultValue={config.address}
                            required 
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} 
                        />
                    </div>

                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                        <button type="submit" className="btn btn-primary">Enregistrer les modifications</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

