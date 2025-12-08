import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json(
                { error: 'Aucun fichier fourni' },
                { status: 400 }
            )
        }

        // Vérifier le type de fichier
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: 'Le fichier doit être une image' },
                { status: 400 }
            )
        }

        // Vérifier la taille
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'Le fichier doit faire moins de 5MB' },
                { status: 400 }
            )
        }

        // Générer un nom de fichier unique
        const timestamp = Date.now()
        const ext = file.name.split('.').pop() || 'png'
        const filename = `logo-${timestamp}.${ext}`

        // Créer le répertoire s'il n'existe pas
        const uploadDir = join(process.cwd(), 'public/assets')
        await mkdir(uploadDir, { recursive: true })

        // Sauvegarder le fichier
        const filepath = join(uploadDir, filename)
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filepath, buffer)

        // Mettre à jour la base de données
        const logoPath = `/assets/${filename}`
        const existing = await prisma.siteConfig.findFirst()

        if (existing) {
            await prisma.siteConfig.update({
                where: { id: existing.id },
                data: { logoPath }
            })
        } else {
            await prisma.siteConfig.create({
                data: { logoPath }
            })
        }

        // Revalider les pages qui utilisent le logo
        revalidatePath('/')
        revalidatePath('/admin/logo')

        return NextResponse.json({
            path: logoPath,
            message: 'Logo mis à jour avec succès'
        })
    } catch (error) {
        console.error('Erreur lors de l\'upload du logo:', error)
        return NextResponse.json(
            { error: 'Erreur lors de l\'upload du logo' },
            { status: 500 }
        )
    }
}
