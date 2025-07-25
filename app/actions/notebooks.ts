"use server"

import { auth } from "@clerk/nextjs/server"
import { createNotebook, getNotebooksForUser, getOrCreateUser } from "@/db"
import { revalidatePath } from "next/cache"

export async function createNewNotebook(formData: FormData) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("You must be signed in to create a notebook")
  }

  const name = formData.get("name") as string

  if (!name) {
    throw new Error("Notebook name is required")
  }

  // Get or create the user in our database
  const user = await getOrCreateUser({ id: userId, emailAddresses: [] })

  // Create the notebook
  await createNotebook({
    name,
    userId: user.id,
  })

  revalidatePath("/dashboard")
}

export async function getUserNotebooks() {
  const { userId } = auth()

  if (!userId) {
    return []
  }

  // Get the user's notebooks
  return getNotebooksForUser(userId)
}
