'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageGalleryProps {
    images: { id: string; url: string }[]
    mainImage: string
    title: string
}

/**
 * Galerie d'images avec lightbox pour les réalisations.
 */
export default function ImageGallery({ images, mainImage, title }: ImageGalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)

    // Combiner image principale et images supplémentaires
    const allImages = [{ id: 'main', url: mainImage }, ...images]

    function openLightbox(index: number) {
        setCurrentIndex(index)
        setLightboxOpen(true)
        document.body.style.overflow = 'hidden'
    }

    function closeLightbox() {
        setLightboxOpen(false)
        document.body.style.overflow = 'auto'
    }

    function next() {
        setCurrentIndex((prev) => (prev + 1) % allImages.length)
    }

    function prev() {
        setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
    }

    return (
        <>
            {/* Grille d'images */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.5rem' }}>
                {allImages.map((img, index) => (
                    <div 
                        key={img.id}
                        onClick={() => openLightbox(index)}
                        style={{ 
                            position: 'relative', 
                            paddingBottom: '100%', 
                            cursor: 'pointer',
                            borderRadius: '0.5rem',
                            overflow: 'hidden',
                            border: index === 0 ? '2px solid var(--color-primary)' : '1px solid var(--color-border)'
                        }}
                    >
                        <Image
                            src={img.url}
                            alt={`${title} - Image ${index + 1}`}
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                        {index === 0 && (
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: 'var(--color-primary)',
                                color: 'white',
                                fontSize: '0.7rem',
                                padding: '0.25rem',
                                textAlign: 'center'
                            }}>
                                Principale
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <div 
                    onClick={closeLightbox}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.95)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {/* Close button */}
                    <button
                        onClick={closeLightbox}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '2rem',
                            cursor: 'pointer',
                            zIndex: 10001
                        }}
                    >
                        ×
                    </button>

                    {/* Navigation */}
                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prev() }}
                                style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    color: 'white',
                                    fontSize: '2rem',
                                    padding: '1rem',
                                    cursor: 'pointer',
                                    borderRadius: '50%'
                                }}
                            >
                                ‹
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); next() }}
                                style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    color: 'white',
                                    fontSize: '2rem',
                                    padding: '1rem',
                                    cursor: 'pointer',
                                    borderRadius: '50%'
                                }}
                            >
                                ›
                            </button>
                        </>
                    )}

                    {/* Image */}
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        style={{ 
                            position: 'relative', 
                            maxWidth: '90vw', 
                            maxHeight: '90vh',
                            width: '100%',
                            height: '80vh'
                        }}
                    >
                        <Image
                            src={allImages[currentIndex].url}
                            alt={`${title} - Image ${currentIndex + 1}`}
                            fill
                            style={{ objectFit: 'contain' }}
                        />
                    </div>

                    {/* Counter */}
                    <div style={{
                        position: 'absolute',
                        bottom: '1rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: 'white',
                        fontSize: '0.9rem'
                    }}>
                        {currentIndex + 1} / {allImages.length}
                    </div>
                </div>
            )}
        </>
    )
}

