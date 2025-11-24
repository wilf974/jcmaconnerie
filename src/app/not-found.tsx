'use client'

import Link from 'next/link'

export default function NotFound() {
    return (
        <div style={{ 
            minHeight: '70vh', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <h1 style={{ fontSize: '6rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>404</h1>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Page introuvable</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            <Link href="/" className="btn btn-primary">
                Retour à l'accueil
            </Link>
        </div>
    )
}

