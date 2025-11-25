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

    // Limite de taille : 20MB
    const maxSize = 20 * 1024 * 1024 // 20MB
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
        
        // Utilisation de process.cwd() pour Docker
        const uploadDir = join(process.cwd(), 'public', 'uploads')
        
        // Créer le dossier avec permissions
        try {
            await mkdir(uploadDir, { recursive: true, mode: 0o755 })
        } catch (mkdirError) {
            console.error('Erreur création dossier uploads:', mkdirError)
            // Continuer même si le dossier existe déjà
        }

        // Nettoyage du nom de fichier
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-')
        const filename = `${Date.now()}-${sanitizedName}`
        const filepath = join(uploadDir, filename)
        
        console.log(`Sauvegarde fichier: ${filepath} (${file.size} bytes)`)
        await writeFile(filepath, buffer, { mode: 0o644 })
        
        const url = `/uploads/${filename}`
        console.log(`Fichier sauvegardé avec succès: ${url}`)
        return url
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
        console.error('Erreur lors de la sauvegarde du fichier:', {
            error: errorMessage,
            stack: error instanceof Error ? error.stack : undefined,
            fileSize: file.size,
            fileName: file.name,
            fileType: file.type
        })
        throw new Error(`Impossible de sauvegarder le fichier: ${errorMessage}`)
    }
}

