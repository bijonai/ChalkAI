import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core'

export const boardsTable = pgTable('boards', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  createdBy: uuid('created_by'),
  public: boolean('public').notNull().default(false),
})