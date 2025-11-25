import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

/**
 * Sauvegarde un fichier uploadé dans le dossier public/uploads
 * @param file - Le fichier à sauvegarder
 * @returns L'URL relative du fichier sauvegardé
 * @throws Error si le fichier est invalide ou si la sauvegarde échoue
 */
export async function saveFile(file: File): Promise<string> {
    // Validation du fichier
    if (!file || file.size === 0) {
        throw new Error('Le fichier est vide')
    }

    // Limite de taille : 10MB
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
        throw new Error(`Le fichier est trop volumineux (max: ${maxSize / 1024 / 1024}MB)`)
    }

    // Validation du type MIME
    if (!file.type.startsWith('image/')) {
        throw new Error('Le fichier doit être une image')
    }

    try {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        // Utilisation de __dirname ou process.cwd() selon l'environnement
        const uploadDir = join(process.cwd(), 'public', 'uploads')
        await mkdir(uploadDir, { recursive: true })

        // Nettoyage du nom de fichier
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-')
        const filename = `${Date.now()}-${sanitizedName}`
        const filepath = join(uploadDir, filename)
        
        await writeFile(filepath, buffer)
        return `/uploads/${filename}`
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du fichier:', error)
        throw new Error(`Impossible de sauvegarder le fichier: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    }
}

