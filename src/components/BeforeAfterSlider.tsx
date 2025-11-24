'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface BeforeAfterSliderProps {
    beforeImage: string
    afterImage: string
    title?: string
}

export default function BeforeAfterSlider({ beforeImage, afterImage, title }: BeforeAfterSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(50)
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
                {/* Before Image (Background) */}
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
                        top: 10,
                        left: 10,
                        background: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.875rem',
                        pointerEvents: 'none',
                        zIndex: 10
                    }}
                >
                    AVANT
                </div>

                {/* After Image (Foreground - Clipped) */}
                <div 
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: `${sliderPosition}%`,
                        overflow: 'hidden',
                        borderRight: '2px solid white'
                    }}
                >
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
                            top: 10,
                            right: 10, // Position relative to the clipped container
                            background: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.875rem',
                            pointerEvents: 'none',
                            zIndex: 10
                        }}
                    >
                        APRÈS
                    </div>
                </div>

                {/* Slider Handle */}
                <div 
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: `${sliderPosition}%`,
                        width: '40px',
                        height: '40px',
                        background: 'white',
                        borderRadius: '50%',
                        transform: 'translate(-50%, calc(50% - 20px))', // Center vertically and horizontally relative to line
                        top: '50%',
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

