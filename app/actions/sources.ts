"use server"

import { auth } from "@clerk/nextjs/server"
import { addSourceToNotebook, getOrCreateUser } from "@/db"
import { revalidatePath } from "next/cache"

export async function addSource(
  notebookId: number,
  sourceData: {
    name: string
    type: string
    url?: string
    fileKey?: string
    size?: string
    metadata?: any
  },
) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("You must be signed in to add a source")
  }

  // Get or create the user in our database
  const user = await getOrCreateUser({ id: userId, emailAddresses: [] })

  // Add the source to the notebook
  await addSourceToNotebook({
    ...sourceData,
    notebookId,
    userId: user.id,
  })

  revalidatePath(`/dashboard/notebook/${notebookId}`)
}
