import { pgTable, serial, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Users table (will be linked with Clerk users)
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk user ID
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Notebooks table
export const notebooks = pgTable("notebooks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Sources table (for uploaded files, YouTube videos, etc.)
export const sources = pgTable("sources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // pdf, youtube, image, etc.
  url: text("url"), // URL for external sources
  fileKey: text("file_key"), // For uploaded files
  size: text("size"),
  notebookId: integer("notebook_id")
    .notNull()
    .references(() => notebooks.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  metadata: jsonb("metadata"), // For additional data like transcript
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Chat messages table
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  role: text("role").notNull(), // user or assistant
  notebookId: integer("notebook_id")
    .notNull()
    .references(() => notebooks.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Notes table
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  notebookId: integer("notebook_id")
    .notNull()
    .references(() => notebooks.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  notebooks: many(notebooks),
  sources: many(sources),
  chatMessages: many(chatMessages),
  notes: many(notes),
}))

export const notebooksRelations = relations(notebooks, ({ one, many }) => ({
  user: one(users, {
    fields: [notebooks.userId],
    references: [users.id],
  }),
  sources: many(sources),
  chatMessages: many(chatMessages),
  notes: many(notes),
}))

export const sourcesRelations = relations(sources, ({ one }) => ({
  notebook: one(notebooks, {
    fields: [sources.notebookId],
    references: [notebooks.id],
  }),
  user: one(users, {
    fields: [sources.userId],
    references: [users.id],
  }),
}))

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  notebook: one(notebooks, {
    fields: [chatMessages.notebookId],
    references: [notebooks.id],
  }),
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
}))

export const notesRelations = relations(notes, ({ one }) => ({
  notebook: one(notebooks, {
    fields: [notes.notebookId],
    references: [notebooks.id],
  }),
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
}))

// Types for our schema
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Notebook = typeof notebooks.$inferSelect
export type NewNotebook = typeof notebooks.$inferInsert

export type Source = typeof sources.$inferSelect
export type NewSource = typeof sources.$inferInsert

export type ChatMessage = typeof chatMessages.$inferSelect
export type NewChatMessage = typeof chatMessages.$inferInsert

export type Note = typeof notes.$inferSelect
export type NewNote = typeof notes.$inferInsert
