'use client'

import { useActionState } from 'react'
import { useState } from 'react'

/**
 * Composant client pour le formulaire d'ajout Avant/Après
 * Utilise useActionState pour gérer les erreurs de Server Action
 */
export default function BeforeAfterForm({ addItem }: { addItem: (formData: FormData) => Promise<void> }) {
    const [state, formAction, isPending] = useActionState(
        async (prevState: any, formData: FormData) => {
            try {
                await addItem(formData)
                return { success: true, error: null }
            } catch (error) {
                return { 
                    success: false, 
                    error: error instanceof Error ? error.message : 'Une erreur est survenue' 
                }
            }
        },
        { success: false, error: null }
    )

    const [beforeFileName, setBeforeFileName] = useState('Aucun fichier sélectionné.')
    const [afterFileName, setAfterFileName] = useState('Aucun fichier sélectionné.')

    if (state.success) {
        // Recharger la page après succès
        window.location.reload()
    }

    return (
        <div className="card mb-md" style={{ marginBottom: '2rem' }}>
            <h3>Ajouter une nouvelle comparaison</h3>
            {state.error && (
                <div style={{
                    background: 'rgba(255, 0, 0, 0.1)',
                    border: '1px solid red',
                    color: 'red',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem'
                }}>
                    <strong>Erreur :</strong> {state.error}
                </div>
            )}
            <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

