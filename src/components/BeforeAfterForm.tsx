'use client'

import { useState } from 'react'

/**
 * Composant client pour le formulaire d'ajout Avant/Après
 * Utilise une route API pour l'upload des fichiers
 */
export default function BeforeAfterForm({ addItem }: { addItem: (formData: FormData) => Promise<void> }) {
    const [error, setError] = useState<string | null>(null)
    const [isPending, setIsPending] = useState(false)
    const [beforeFileName, setBeforeFileName] = useState('Aucun fichier sélectionné.')
    const [afterFileName, setAfterFileName] = useState('Aucun fichier sélectionné.')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)
        setIsPending(true)

        try {
            const formData = new FormData(e.currentTarget)
            const title = formData.get('title') as string
            const beforeImageFile = formData.get('beforeImage') as File
            const afterImageFile = formData.get('afterImage') as File

            if (!title || !beforeImageFile || !afterImageFile || beforeImageFile.size === 0 || afterImageFile.size === 0) {
                throw new Error('Tous les champs sont requis')
            }

            // Upload des fichiers via API
            const [beforeRes, afterRes] = await Promise.all([
                uploadFile(beforeImageFile),
                uploadFile(afterImageFile)
            ])

            if (!beforeRes.success || !afterRes.success) {
                throw new Error(beforeRes.error || afterRes.error || 'Erreur lors de l\'upload')
            }

            // Créer l'entrée en base via Server Action
            console.log('Création en base avec:', { title, beforeUrl: beforeRes.url, afterUrl: afterRes.url })
            const actionFormData = new FormData()
            actionFormData.append('title', title)
            actionFormData.append('beforeImageUrl', beforeRes.url!)
            actionFormData.append('afterImageUrl', afterRes.url!)

            try {
                await addItem(actionFormData)
                console.log('Création réussie')
            } catch (err) {
                console.error('Erreur création:', err)
                throw err
            }
            
            // Recharger la page après succès
            window.location.reload()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue')
        } finally {
            setIsPending(false)
        }
    }

    async function uploadFile(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
        try {
            console.log('Upload fichier:', { name: file.name, size: file.size, type: file.type })
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            console.log('Réponse upload:', { status: response.status, ok: response.ok })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }))
                console.error('Erreur upload:', errorData)
                return { success: false, error: errorData.error || `Erreur HTTP ${response.status}` }
            }

            const data = await response.json()
            console.log('Upload réussi:', data)
            return { success: true, url: data.url }
        } catch (err) {
            console.error('Exception upload:', err)
            return { success: false, error: err instanceof Error ? err.message : 'Erreur upload' }
        }
    }

    return (
        <div className="card mb-md" style={{ marginBottom: '2rem' }}>
            <h3>Ajouter une nouvelle comparaison</h3>
            {error && (
                <div style={{
                    background: 'rgba(255, 0, 0, 0.1)',
                    border: '1px solid red',
                    color: 'red',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem'
                }}>
                    <strong>Erreur :</strong> {error}
                </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Titre</label>
                    <input 
                        type="text" 
                        name="title" 
                        required 
                        disabled={isPending}
                        style={{ width: '100%', padding: '0.5rem' }} 
                        placeholder="Ex: Rénovation Façade" 
                    />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Image Avant</label>
                        <input 
                            type="file" 
                            name="beforeImage" 
                            required 
                            accept="image/*" 
                            disabled={isPending}
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                setBeforeFileName(file ? file.name : 'Aucun fichier sélectionné.')
                            }}
                            style={{ width: '100%', padding: '0.5rem' }} 
                        />
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                            {beforeFileName}
                        </p>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Image Après</label>
                        <input 
                            type="file" 
                            name="afterImage" 
                            required 
                            accept="image/*" 
                            disabled={isPending}
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                setAfterFileName(file ? file.name : 'Aucun fichier sélectionné.')
                            }}
                            style={{ width: '100%', padding: '0.5rem' }} 
                        />
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                            {afterFileName}
                        </p>
                    </div>
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isPending}
                >
                    {isPending ? 'Ajout en cours...' : 'Ajouter'}
                </button>
            </form>
        </div>
    )
}

