'use client'

import { useState } from 'react'

interface ContactFormProps {
    submitContact: (formData: FormData) => Promise<void>
}

/**
 * Formulaire de contact avec confirmation visuelle après soumission.
 */
export default function ContactForm({ submitContact }: ContactFormProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setStatus('loading')

        try {
            const formData = new FormData(e.currentTarget)
            await submitContact(formData)
            setStatus('success')
            e.currentTarget.reset()
        } catch {
            setStatus('error')
        }
    }

    if (status === 'success') {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '50%', 
                    background: 'var(--color-primary)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem'
                }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <h3 style={{ marginBottom: '1rem' }}>Message envoyé !</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>
                    Merci de nous avoir contacté. Nous vous répondrons dans les plus brefs délais.
                </p>
                <button 
                    onClick={() => setStatus('idle')} 
                    className="btn btn-outline" 
                    style={{ marginTop: '1.5rem' }}
                >
                    Envoyer un autre message
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {status === 'error' && (
                <div style={{ 
                    padding: '1rem', 
                    background: 'rgba(220, 38, 38, 0.1)', 
                    border: '1px solid rgba(220, 38, 38, 0.3)',
                    borderRadius: '0.5rem',
                    color: '#fca5a5'
                }}>
                    Une erreur est survenue. Veuillez réessayer.
                </div>
            )}

            <div>
                <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>Nom</label>
                <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    disabled={status === 'loading'}
                    style={{ 
                        width: '100%', 
                        padding: '0.75rem', 
                        background: 'var(--color-background)', 
                        border: '1px solid var(--color-border)', 
                        color: 'var(--color-text)',
                        borderRadius: '0.5rem'
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
                    disabled={status === 'loading'}
                    style={{ 
                        width: '100%', 
                        padding: '0.75rem', 
                        background: 'var(--color-background)', 
                        border: '1px solid var(--color-border)', 
                        color: 'var(--color-text)',
                        borderRadius: '0.5rem'
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
                    disabled={status === 'loading'}
                    style={{ 
                        width: '100%', 
                        padding: '0.75rem', 
                        background: 'var(--color-background)', 
                        border: '1px solid var(--color-border)', 
                        color: 'var(--color-text)',
                        borderRadius: '0.5rem',
                        resize: 'vertical'
                    }} 
                />
            </div>

            <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={status === 'loading'}
                style={{ marginTop: '1rem' }}
            >
                {status === 'loading' ? 'Envoi en cours...' : 'Envoyer le message'}
            </button>
        </form>
    )
}

