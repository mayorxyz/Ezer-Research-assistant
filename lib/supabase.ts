import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for the entire app
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Helper function for file uploads
export async function uploadFile(file: File, bucket: string, path: string) {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    throw new Error(`Error uploading file: ${error.message}`)
  }

  return data
}

// Helper function to get a public URL for a file
export function getFileUrl(bucket: string, path: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

// Helper function to delete a file
export async function deleteFile(bucket: string, path: string) {
  const { error } = await supabase.storage.from(bucket).remove([path])

  if (error) {
    throw new Error(`Error deleting file: ${error.message}`)
  }

  return true
}
