import { index, jsonb, pgTable, text, uuid, vector } from "drizzle-orm/pg-core";

export const prefabKnowledgeTable = pgTable('prefab_knowledge', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').unique().notNull(),
  description: text('description').notNull(),
  tags: text('tags').array().notNull(),
  props: jsonb('props').notNull(),
  examples: text('examples').array().notNull().default([]),
  rules: text('rules').array().notNull().default([]),
  slots: jsonb('slots').array().notNull().default([]),

  embedding: vector('embedding', { dimensions: parseInt(process.env.VECTOR_SIZE!) }).notNull(),
}, (table) => [
  index('embeddingKnowledge').using('hnsw', table.embedding.op('vector_cosine_ops')),
])