import { index, jsonb, pgTable, text, uuid, vector } from 'drizzle-orm/pg-core'

export const prefabCalculatorTable = pgTable('prefab_calculator', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').unique().notNull(),
  description: text('description').notNull(),
  args: jsonb('args').notNull(),
  return: jsonb('return').notNull(),

  embedding: vector('embedding', { dimensions: parseInt(process.env.VECTOR_SIZE!) }).notNull(),
}, (table) => [
  index('embeddingCalculator').using('hnsw', table.embedding.op('vector_cosine_ops')),
])