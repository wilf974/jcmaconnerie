import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export const dynamic = 'force-dynamic'

export default async function HomepageAdminPage() {
    // Get existing config or use defaults
    const config = await prisma.homepageConfig.findFirst() || {
        heroTitle: "L'Art de la Maçonnerie Premium",
        heroSubtitle: "Expertise, précision et qualité pour tous vos projets de construction et de rénovation.",
        heroButtonText: "Demander un devis",
        heroButtonLink: "/contact",
        heroButton2Text: "Voir nos réalisations",
        heroButton2Link: "/realisations"
    }

    async function updateConfig(formData: FormData) {
        'use server'
        
        const data = {
            heroTitle: formData.get('heroTitle') as string,
            heroSubtitle: formData.get('heroSubtitle') as string,
            heroButtonText: formData.get('heroButtonText') as string,
            heroButtonLink: formData.get('heroButtonLink') as string,
            heroButton2Text: formData.get('heroButton2Text') as string,
            heroButton2Link: formData.get('heroButton2Link') as string,
        }

        // Upsert: create if not exists, update if exists
        const existing = await prisma.homepageConfig.findFirst()
        
        if (existing) {
            await prisma.homepageConfig.update({
                where: { id: existing.id },
                data
            })
        } else {
            await prisma.homepageConfig.create({
                data
            })
        }

        revalidatePath('/admin/accueil')
        revalidatePath('/')
    }

    return (
        <div>
            <h1>Gérer la Page d'Accueil</h1>
            
            <div className="card">
                <h3>Section Héro (Haut de page)</h3>
                <form action={updateConfig} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                    
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Titre Principal</label>
                        <input 
                            type="text" 
                            name="heroTitle" 
                            defaultValue={config.heroTitle}
                            required 
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} 
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Sous-titre</label>
                        <textarea 
                            name="heroSubtitle" 
                            defaultValue={config.heroSubtitle}
                            required 
                            rows={3}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} 
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Bouton Principal</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Texte</label>
                                    <input 
                                        type="text" 
                                        name="heroButtonText" 
                                        defaultValue={config.heroButtonText}
                                        required 
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} 
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Lien</label>
                                    <input 
                                        type="text" 
                                        name="heroButtonLink" 
                                        defaultValue={config.heroButtonLink}
                                        required 
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} 
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Bouton Secondaire</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Texte</label>
                                    <input 
                                        type="text" 
                                        name="heroButton2Text" 
                                        defaultValue={config.heroButton2Text}
                                        required 
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} 
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Lien</label>
                                    <input 
                                        type="text" 
                                        name="heroButton2Link" 
                                        defaultValue={config.heroButton2Link}
                                        required 
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', marginTop: '1rem' }}>
                        <button type="submit" className="btn btn-primary">Enregistrer les modifications</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

