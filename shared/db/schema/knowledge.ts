import { jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const knowledgeTable = pgTable('knowledge', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').unique().notNull(),
  description: text('description'),
  
  prefabs: jsonb('prefabs').array().notNull().default([]),
  calculators: jsonb('calculators').array().notNull().default([]),
})