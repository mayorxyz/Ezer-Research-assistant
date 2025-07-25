"use server"

import { auth } from "@clerk/nextjs/server"
import { addSourceToNotebook, getOrCreateUser } from "@/db"
import { revalidatePath } from "next/cache"
import { uploadFile, getFileUrl } from "@/lib/supabase"

export async function uploadFileToNotebook(notebookId: number, file: File) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("You must be signed in to upload files")
  }

  // Get or create the user in our database
  const user = await getOrCreateUser({ id: userId, emailAddresses: [] })

  // Generate a unique file path
  const fileExtension = file.name.split(".").pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`
  const filePath = `${user.id}/${notebookId}/${fileName}`

  // Upload the file to Supabase Storage
  await uploadFile(file, "sources", filePath)

  // Get the public URL
  const fileUrl = getFileUrl("sources", filePath)

  // Add the source to the database
  await addSourceToNotebook({
    name: file.name,
    type: file.type,
    url: fileUrl,
    fileKey: filePath,
    size: formatFileSize(file.size),
    notebookId,
    userId: user.id,
  })

  revalidatePath(`/dashboard/notebook/${notebookId}`)

  return { success: true, fileUrl }
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
