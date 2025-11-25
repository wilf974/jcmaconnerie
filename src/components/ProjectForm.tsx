'use client'

import { useState } from 'react'

interface ProjectFormProps {
    addProject: (formData: FormData) => Promise<void>
}

/**
 * Formulaire d'ajout de réalisation avec upload multiple d'images.
 */
export default function ProjectForm({ addProject }: ProjectFormProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [error, setError] = useState<string | null>(null)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setStatus('loading')
        setError(null)

        try {
            const form = e.currentTarget
            const formData = new FormData(form)
            
            // Upload image principale
            const mainImage = formData.get('image') as File
            if (!mainImage || mainImage.size === 0) {
                throw new Error('Image principale requise')
            }

            const mainUploadRes = await uploadFile(mainImage)
            if (!mainUploadRes.success) throw new Error(mainUploadRes.error)
            
            // Upload images supplémentaires
            const additionalUrls: string[] = []
            for (const file of selectedFiles) {
                const res = await uploadFile(file)
                if (res.success && res.url) {
                    additionalUrls.push(res.url)
                }
            }

            // Créer le projet via Server Action
            const actionFormData = new FormData()
            actionFormData.append('title', formData.get('title') as string)
            actionFormData.append('description', formData.get('description') as string)
            actionFormData.append('imageUrl', mainUploadRes.url!)
            actionFormData.append('additionalImages', JSON.stringify(additionalUrls))

            await addProject(actionFormData)
            setStatus('success')
            form.reset()
            setSelectedFiles([])
            window.location.reload()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout')
            setStatus('error')
        }
    }

    async function uploadFile(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
        try {
            const formData = new FormData()
            formData.append('file', file)
            const response = await fetch('/api/upload', { method: 'POST', body: formData })
            const data = await response.json()
            if (!response.ok) return { success: false, error: data.error || 'Erreur upload' }
            return { success: true, url: data.url }
        } catch {
            return { success: false, error: 'Erreur upload' }
        }
    }

    function handleAdditionalFiles(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files))
        }
    }

    function removeFile(index: number) {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="card mb-md" style={{ marginBottom: '2rem' }}>
            <h3>Ajouter une nouvelle réalisation</h3>
            
            {error && (
                <div style={{ 
                    padding: '1rem', 
                    background: 'rgba(220, 38, 38, 0.1)', 
                    border: '1px solid rgba(220, 38, 38, 0.3)',
                    borderRadius: '0.5rem',
                    color: '#fca5a5',
                    marginBottom: '1rem'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Titre du projet</label>
                    <input 
                        type="text" 
                        name="title" 
                        required 
                        disabled={status === 'loading'}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} 
                        placeholder="Ex: Villa Moderne à Bordeaux" 
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                    <textarea 
                        name="description" 
                        required 
                        rows={3} 
                        disabled={status === 'loading'}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', background: 'var(--color-background)', color: 'var(--color-text)' }} 
                        placeholder="Détails du chantier..." 
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Photo principale *</label>
                    <input 
                        type="file" 
                        name="image" 
                        required 
                        accept="image/*" 
                        disabled={status === 'loading'}
                        style={{ width: '100%', padding: '0.5rem' }} 
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Photos supplémentaires (galerie)</label>
                    <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        disabled={status === 'loading'}
                        onChange={handleAdditionalFiles}
                        style={{ width: '100%', padding: '0.5rem' }} 
                    />
                    {selectedFiles.length > 0 && (
                        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {selectedFiles.map((file, index) => (
                                <div key={index} style={{ 
                                    padding: '0.25rem 0.5rem', 
                                    background: 'var(--color-surface)', 
                                    borderRadius: '0.25rem',
                                    fontSize: '0.8rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    {file.name}
                                    <button 
                                        type="button" 
                                        onClick={() => removeFile(index)}
                                        style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={status === 'loading'}
                >
                    {status === 'loading' ? 'Ajout en cours...' : 'Ajouter'}
                </button>
            </form>
        </div>
    )
}

