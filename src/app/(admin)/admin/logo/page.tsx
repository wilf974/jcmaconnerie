'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function LogoAdminPage() {
    const [logo, setLogo] = useState<string>('/assets/Logo.png')
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError('Le fichier doit faire moins de 5MB')
                return
            }
            if (!selectedFile.type.startsWith('image/')) {
                setError('Le fichier doit être une image')
                return
            }
            setFile(selectedFile)
            setError(null)

            // Afficher un aperçu
            const reader = new FileReader()
            reader.onload = (e) => {
                setLogo(e.target?.result as string)
            }
            reader.readAsDataURL(selectedFile)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) {
            setError('Veuillez sélectionner un fichier')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/upload-logo', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Erreur lors de l\'upload')
            }

            const data = await response.json()
            setLogo(data.path)
            setFile(null)
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)

            // Actualiser la page pour voir le nouveau logo
            setTimeout(() => window.location.reload(), 1500)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h1>Gérer le Logo</h1>

            <div className="card" style={{ maxWidth: '600px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    <div style={{ textAlign: 'center', padding: '2rem', border: '2px dashed var(--color-border)', borderRadius: '0.5rem' }}>
                        <div style={{ marginBottom: '1rem', position: 'relative', width: '150px', height: '150px', margin: '0 auto' }}>
                            <Image
                                src={logo}
                                alt="Logo aperçu"
                                width={150}
                                height={150}
                                style={{ objectFit: 'contain' }}
                            />
                        </div>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Logo actuel</p>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                            Télécharger un nouveau logo
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{
                                display: 'block',
                                padding: '0.75rem',
                                borderRadius: '0.25rem',
                                border: '1px solid var(--color-border)',
                                width: '100%',
                            }}
                        />
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                            Formats acceptés: JPG, PNG, GIF, SVG (Max 5MB)
                        </p>
                    </div>

                    {error && (
                        <div style={{
                            padding: '1rem',
                            background: '#fee2e2',
                            color: '#991b1b',
                            borderRadius: '0.25rem',
                            fontSize: '0.875rem'
                        }}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div style={{
                            padding: '1rem',
                            background: '#dcfce7',
                            color: '#166534',
                            borderRadius: '0.25rem',
                            fontSize: '0.875rem'
                        }}>
                            Logo mis à jour avec succès!
                        </div>
                    )}

                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                        <button
                            type="submit"
                            disabled={!file || loading}
                            className="btn btn-primary"
                            style={{ opacity: !file || loading ? 0.6 : 1 }}
                        >
                            {loading ? 'Téléchargement...' : 'Mettre à jour le logo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
