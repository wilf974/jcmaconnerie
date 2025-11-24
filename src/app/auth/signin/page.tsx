'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function SignInPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            if (res?.error) {
                setError('Email ou mot de passe incorrect')
            } else {
                router.push('/admin')
                router.refresh()
            }
        } catch (error) {
            setError('Une erreur est survenue')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, var(--color-surface) 0%, var(--color-background) 100%)'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Link href="/" style={{ display: 'inline-block', marginBottom: '1rem' }}>
                        <Image
                            src="/assets/Logo.jpg"
                            alt="JC Maçonnerie"
                            width={80}
                            height={80}
                            style={{ borderRadius: '50%', border: '2px solid var(--color-primary)' }}
                        />
                    </Link>
                    <h1>Connexion Admin</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Espace réservé à l'administrateur</p>
                </div>

                {error && (
                    <div style={{ 
                        background: 'rgba(255, 0, 0, 0.1)', 
                        border: '1px solid red', 
                        color: 'red', 
                        padding: '0.75rem', 
                        borderRadius: '0.5rem',
                        marginBottom: '1rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
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
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
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
                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={isLoading}
                        style={{ width: '100%', marginTop: '1rem' }}
                    >
                        {isLoading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>
                
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <Link href="/" className="text-sm" style={{ color: 'var(--color-text-muted)', textDecoration: 'underline' }}>
                        Retour au site
                    </Link>
                </div>
            </div>
        </div>
    )
}

