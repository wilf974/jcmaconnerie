import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

/**
 * Route API pour l'upload de fichiers
 * POST /api/upload
 */
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file || file.size === 0) {
            return NextResponse.json(
                { error: 'Le fichier est vide' },
                { status: 400 }
            )
        }

        // Limite de taille : 10MB
        const maxSize = 10 * 1024 * 1024
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: `Le fichier est trop volumineux (max: ${maxSize / 1024 / 1024}MB)` },
                { status: 400 }
            )
        }

        // Validation du type MIME
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: 'Le fichier doit être une image' },
                { status: 400 }
            )
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const uploadDir = join(process.cwd(), 'public', 'uploads')
        await mkdir(uploadDir, { recursive: true, mode: 0o755 })

        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-')
        const filename = `${Date.now()}-${sanitizedName}`
        const filepath = join(uploadDir, filename)

        await writeFile(filepath, buffer, { mode: 0o644 })

        return NextResponse.json({
            success: true,
            url: `/uploads/${filename}`
        })
    } catch (error) {
        console.error('Erreur upload API:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Erreur lors de l\'upload' },
            { status: 500 }
        )
    }
}

