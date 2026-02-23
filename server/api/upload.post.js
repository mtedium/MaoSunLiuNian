import { writeFile, mkdir } from 'fs/promises'
import { resolve, join } from 'path'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  const files = await readMultipartFormData(event)
  if (!files || files.length === 0) {
    throw createError({ statusCode: 400, message: 'No file uploaded' })
  }

  const uploadDir = resolve(process.cwd(), 'public', 'uploads')
  await mkdir(uploadDir, { recursive: true })

  const uploadedFiles = []

  for (const file of files) {
    // Assuming the field name is 'file' or just taking any file
    if (file.filename) {
      const ext = file.filename.split('.').pop()
      const filename = `${randomUUID()}.${ext}`
      const filePath = join(uploadDir, filename)
      
      await writeFile(filePath, file.data)
      uploadedFiles.push(`/uploads/${filename}`)
    }
  }

  if (uploadedFiles.length === 0) {
     throw createError({ statusCode: 400, message: 'No valid file uploaded' })
  }

  return { url: uploadedFiles[0] }
})
