'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

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
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
        Nous nous excusons pour la gêne occasionnée.
      </p>
      <button
        onClick={reset}
        className="btn btn-primary"
      >
        Réessayer
      </button>
    </div>
  )
}

