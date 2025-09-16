import { pgTable, uuid, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core'

export const classroomTable = pgTable('classroom', {
  // Basic fields
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  createdBy: uuid('created_by'),
  public: boolean('public').notNull().default(false),

  // AI && LLM fields
  context: jsonb('context').notNull().default('[]'),
  status: text('status').notNull().default('pending'),

  // Result fields
  result: jsonb('result').notNull().default('{}')
})