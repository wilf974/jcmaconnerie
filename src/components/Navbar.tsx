'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} onClick={() => setIsOpen(false)}>
                    <Image
                        src="/assets/Logo.jpg"
                        alt="JC Maçonnerie"
                        width={40}
                        height={40}
                        style={{ borderRadius: '50%' }}
                    />
                    <h2 style={{ color: 'white', margin: 0, fontSize: '1.2rem' }}>JC Maçonnerie</h2>
                </Link>
                
                <button 
                    className="mobile-menu-btn" 
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Menu"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {isOpen ? (
                            <path d="M18 6L6 18M6 6l12 12" />
                        ) : (
                            <path d="M3 12h18M3 6h18M3 18h18" />
                        )}
                    </svg>
                </button>

                <div className={`nav-links ${isOpen ? 'open' : ''}`}>
                    <Link href="/" className="nav-link" onClick={() => setIsOpen(false)}>Accueil</Link>
                    <Link href="/services" className="nav-link" onClick={() => setIsOpen(false)}>Services</Link>
                    <Link href="/realisations" className="nav-link" onClick={() => setIsOpen(false)}>Réalisations</Link>
                    <Link href="/avis" className="nav-link" onClick={() => setIsOpen(false)}>Avis</Link>
                    <Link href="/contact" className="nav-link" onClick={() => setIsOpen(false)}>Contact</Link>
                </div>
            </div>
        </nav>
    )
}
