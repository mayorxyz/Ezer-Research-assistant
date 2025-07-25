import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

// For use with Supabase
const connectionString = process.env.DATABASE_URL!

// For use in Node.js
const client = postgres(connectionString, {
  max: 1,
  ssl: "require", // Required for Supabase connections
})

export const db = drizzle(client, { schema })

// Helper function to get a user by Clerk ID
export async function getUserByClerkId(clerkId: string) {
  const users = await db
    .select()
    .from(schema.users)
    .where(({ id }) => id.equals(clerkId))
  return users[0]
}

// Helper function to create a user from Clerk data
export async function createUser(clerkUser: { id: string; emailAddresses: { emailAddress: string }[] }) {
  const email = clerkUser.emailAddresses[0]?.emailAddress

  if (!email) {
    throw new Error("User must have an email address")
  }

  const newUser = await db
    .insert(schema.users)
    .values({
      id: clerkUser.id,
      email,
    })
    .returning()

  return newUser[0]
}

// Helper function to get or create a user
export async function getOrCreateUser(clerkUser: { id: string; emailAddresses: { emailAddress: string }[] }) {
  const existingUser = await getUserByClerkId(clerkUser.id)

  if (existingUser) {
    return existingUser
  }

  return createUser(clerkUser)
}

// Helper function to get all notebooks for a user
export async function getNotebooksForUser(userId: string) {
  return db
    .select()
    .from(schema.notebooks)
    .where(({ userId: id }) => id.equals(userId))
}

// Helper function to get a notebook with its sources
export async function getNotebookWithSources(notebookId: number, userId: string) {
  const notebook = await db
    .select()
    .from(schema.notebooks)
    .where(({ id, userId: uid }) => id.equals(notebookId).and(uid.equals(userId)))
    .limit(1)

  if (!notebook[0]) {
    return null
  }

  const sources = await db
    .select()
    .from(schema.sources)
    .where(({ notebookId: nid }) => nid.equals(notebookId))

  return {
    ...notebook[0],
    sources,
  }
}

// Helper function to create a new notebook
export async function createNotebook(data: schema.NewNotebook) {
  const result = await db.insert(schema.notebooks).values(data).returning()
  return result[0]
}

// Helper function to add a source to a notebook
export async function addSourceToNotebook(data: schema.NewSource) {
  const result = await db.insert(schema.sources).values(data).returning()
  return result[0]
}

// Helper function to add a chat message
export async function addChatMessage(data: schema.NewChatMessage) {
  const result = await db.insert(schema.chatMessages).values(data).returning()
  return result[0]
}

// Helper function to get chat history for a notebook
export async function getChatHistory(notebookId: number) {
  return db
    .select()
    .from(schema.chatMessages)
    .where(({ notebookId: nid }) => nid.equals(notebookId))
    .orderBy(({ createdAt }) => createdAt)
}

// Helper function to create a note
export async function createNote(data: schema.NewNote) {
  const result = await db.insert(schema.notes).values(data).returning()
  return result[0]
}

// Helper function to get notes for a notebook
export async function getNotesForNotebook(notebookId: number) {
  return db
    .select()
    .from(schema.notes)
    .where(({ notebookId: nid }) => nid.equals(notebookId))
}
