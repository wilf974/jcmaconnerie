'use client'

import { useEffect } from 'react'

/**
 * Composant d'erreur global pour Next.js
 * Affiche les erreurs de manière conviviale avec des détails en mode développement
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Erreur détectée:', error)
  }, [error])

  const isDev = process.env.NODE_ENV === 'development'

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
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Une erreur est survenue</h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
        Nous nous excusons pour la gêne occasionnée.
      </p>
      
      {isDev && error.message && (
        <div style={{
          background: 'var(--color-surface)',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '2rem',
          maxWidth: '600px',
          textAlign: 'left'
        }}>
          <strong style={{ color: 'var(--color-error)' }}>Détails de l'erreur :</strong>
          <pre style={{ 
            marginTop: '0.5rem', 
            fontSize: '0.875rem',
            overflow: 'auto',
            color: 'var(--color-text-muted)'
          }}>
            {error.message}
          </pre>
        </div>
      )}
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={reset}
          className="btn btn-primary"
        >
          Réessayer
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="btn btn-outline"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  )
}

