'use client'

import { useState } from 'react'

interface ReviewFormProps {
    submitReview: (formData: FormData) => Promise<void>
}

/**
 * Formulaire de soumission d'avis avec confirmation visuelle.
 */
export default function ReviewForm({ submitReview }: ReviewFormProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setStatus('loading')

        try {
            const formData = new FormData(e.currentTarget)
            await submitReview(formData)
            setStatus('success')
            e.currentTarget.reset()
        } catch {
            setStatus('error')
        }
    }

    if (status === 'success') {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', maxWidth: '600px', margin: '0 auto 4rem' }}>
                <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '50%', 
                    background: 'var(--color-accent)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem'
                }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                </div>
                <h3 style={{ marginBottom: '1rem' }}>Merci pour votre avis !</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>
                    Votre avis a bien été enregistré. Il sera publié après modération.
                </p>
                <button 
                    onClick={() => setStatus('idle')} 
                    className="btn btn-outline" 
                    style={{ marginTop: '1.5rem' }}
                >
                    Laisser un autre avis
                </button>
            </div>
        )
    }

    return (
        <div className="card mb-md" style={{ maxWidth: '600px', margin: '0 auto 4rem' }}>
            <h3 className="text-center mb-sm">Donner votre avis</h3>
            <p className="text-center mb-md" style={{ fontSize: '0.9rem' }}>
                Votre avis compte pour nous ! Il sera publié après modération.
            </p>

            {status === 'error' && (
                <div style={{ 
                    padding: '1rem', 
                    background: 'rgba(220, 38, 38, 0.1)', 
                    border: '1px solid rgba(220, 38, 38, 0.3)',
                    borderRadius: '0.5rem',
                    color: '#fca5a5',
                    marginBottom: '1rem'
                }}>
                    Une erreur est survenue. Veuillez réessayer.
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Votre nom</label>
                        <input 
                            type="text" 
                            name="name" 
                            required 
                            disabled={status === 'loading'}
                            style={{ 
                                width: '100%', 
                                padding: '0.75rem', 
                                borderRadius: '0.5rem', 
                                border: '1px solid var(--color-border)', 
                                background: 'var(--color-background)', 
                                color: 'var(--color-text)' 
                            }} 
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Note</label>
                        <select 
                            name="rating" 
                            disabled={status === 'loading'}
                            style={{ 
                                width: '100%', 
                                padding: '0.75rem', 
                                borderRadius: '0.5rem', 
                                border: '1px solid var(--color-border)', 
                                background: 'var(--color-background)', 
                                color: 'var(--color-text)' 
                            }} 
                            defaultValue="5"
                        >
                            <option value="5">★★★★★ (Excellent)</option>
                            <option value="4">★★★★☆ (Très bien)</option>
                            <option value="3">★★★☆☆ (Bien)</option>
                            <option value="2">★★☆☆☆ (Moyen)</option>
                            <option value="1">★☆☆☆☆ (Déçu)</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Votre message</label>
                    <textarea 
                        name="content" 
                        required 
                        rows={4} 
                        disabled={status === 'loading'}
                        style={{ 
                            width: '100%', 
                            padding: '0.75rem', 
                            borderRadius: '0.5rem', 
                            border: '1px solid var(--color-border)', 
                            background: 'var(--color-background)', 
                            color: 'var(--color-text)',
                            resize: 'vertical'
                        }}
                    ></textarea>
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={status === 'loading'}
                >
                    {status === 'loading' ? 'Envoi en cours...' : 'Envoyer mon avis'}
                </button>
            </form>
        </div>
    )
}

