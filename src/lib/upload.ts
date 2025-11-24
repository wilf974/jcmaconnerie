import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function saveFile(file: File): Promise<string> {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const filepath = join(uploadDir, filename)
    
    await writeFile(filepath, buffer)
    return `/uploads/${filename}`
}

