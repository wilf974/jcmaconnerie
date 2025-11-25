'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface BeforeAfterSliderProps {
    beforeImage: string
    afterImage: string
    title?: string
}

export default function BeforeAfterSlider({ beforeImage, afterImage, title }: BeforeAfterSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(100)
    const containerRef = useRef<HTMLDivElement>(null)

    const handleMove = (event: React.MouseEvent | React.TouchEvent) => {
        if (!containerRef.current) return

        const containerRect = containerRef.current.getBoundingClientRect()
        let clientX;

        if ('touches' in event) {
             clientX = event.touches[0].clientX;
        } else {
             clientX = (event as React.MouseEvent).clientX;
        }
        
        const x = clientX - containerRect.left 
        const position = Math.max(0, Math.min(100, (x / containerRect.width) * 100))
        setSliderPosition(position)
    }

    return (
        <div className="before-after-container" style={{ width: '100%', margin: '0 auto' }}>
            {title && <h3 className="text-center mb-md">{title}</h3>}
            
            <div 
                ref={containerRef}
                className="slider-wrapper"
                onMouseMove={handleMove}
                onTouchMove={handleMove}
                style={{ 
                    position: 'relative', 
                    width: '100%', 
                    // Use padding-bottom hack for aspect ratio to ensure compatibility and visibility
                    // 16:10 ratio (62.5%) for better vertical space
                    paddingBottom: '62.5%', 
                    overflow: 'hidden',
                    cursor: 'ew-resize',
                    borderRadius: '0.5rem',
                    boxShadow: 'var(--shadow-lg)',
                    minHeight: '400px' // Force minimum height
                }}
            >
                {/* After Image (Background - Résultat final) */}
                <Image
                    src={afterImage}
                    alt="Après travaux"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                />
                
                <div 
                    style={{
                        position: 'absolute',
                        top: 20,
                        left: 20,
                        background: 'rgba(0,0,0,0.75)',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        pointerEvents: 'none',
                        zIndex: 10,
                        border: '2px solid white',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                    }}
                >
                    Après travaux
                </div>

                {/* Before Image (Foreground - Clipped, disparaît en glissant) */}
                <div 
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        width: `${100 - sliderPosition}%`,
                        overflow: 'hidden',
                        borderLeft: '2px solid white'
                    }}
                >
                    <Image
                        src={beforeImage}
                        alt="Avant travaux"
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                     <div 
                        style={{
                            position: 'absolute',
                            top: 20,
                            right: 20,
                            background: 'rgba(0,0,0,0.75)',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            pointerEvents: 'none',
                            zIndex: 10,
                            border: '2px solid white',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                        }}
                    >
                        Avant travaux
                    </div>
                </div>

                {/* Slider Handle */}
                <div
                    style={{
                        position: 'absolute',
                        left: `${sliderPosition}%`,
                        top: '50%',
                        width: '40px',
                        height: '40px',
                        background: 'white',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                        pointerEvents: 'none'
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8L22 12L18 16" />
                        <path d="M6 8L2 12L6 16" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

