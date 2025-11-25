import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export const dynamic = 'force-dynamic'

/**
 * Route API pour servir les fichiers uploadés
 * GET /uploads/[filename]
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    try {
        const filename = params.path.join('/')
        
        // Sécurité : empêcher les path traversal
        if (filename.includes('..') || filename.includes('/')) {
            return NextResponse.json(
                { error: 'Invalid path' },
                { status: 400 }
            )
        }

        const filepath = join(process.cwd(), 'public', 'uploads', filename)
        
        // Vérifier que le fichier existe
        if (!existsSync(filepath)) {
            return NextResponse.json(
                { error: 'File not found' },
                { status: 404 }
            )
        }

        // Lire le fichier
        const fileBuffer = await readFile(filepath)
        
        // Déterminer le type MIME
        const ext = filename.split('.').pop()?.toLowerCase()
        const mimeTypes: Record<string, string> = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'svg': 'image/svg+xml'
        }
        const contentType = mimeTypes[ext || ''] || 'application/octet-stream'

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        })
    } catch (error) {
        console.error('Erreur lecture fichier:', error)
        return NextResponse.json(
            { error: 'Error reading file' },
            { status: 500 }
        )
    }
}

