"use server"

import { auth } from "@clerk/nextjs/server"
import { addChatMessage, getChatHistory, getOrCreateUser } from "@/db"
import { revalidatePath } from "next/cache"

export async function sendChatMessage(notebookId: number, content: string) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("You must be signed in to send a message")
  }

  // Get or create the user in our database
  const user = await getOrCreateUser({ id: userId, emailAddresses: [] })

  // Add the user message
  await addChatMessage({
    content,
    role: "user",
    notebookId,
    userId: user.id,
  })

  // Here you would typically call your AI service to generate a response
  // For now, we'll just add a mock response
  await addChatMessage({
    content: "This is a mock response from the AI assistant.",
    role: "assistant",
    notebookId,
    userId: user.id,
  })

  revalidatePath(`/dashboard/notebook/${notebookId}`)
}

export async function getNotebookChatHistory(notebookId: number) {
  const { userId } = auth()

  if (!userId) {
    return []
  }

  return getChatHistory(notebookId)
}
