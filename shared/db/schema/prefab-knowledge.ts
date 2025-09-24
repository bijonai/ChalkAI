import { index, jsonb, pgTable, text, uuid, vector } from "drizzle-orm/pg-core";

export const prefabKnowledgeTable = pgTable('prefab_knowledge', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').unique().notNull(),
  description: text('description').notNull(),
  tags: text('tags').array().notNull(),
  props: jsonb('props').notNull(),

  embedding: vector('embedding', { dimensions: parseInt(process.env.VECTOR_SIZE!) }).notNull(),
}, (table) => [
  index('embeddingIndex').using('hnsw', table.embedding.op('vector_cosine_ops')),
])