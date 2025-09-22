import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { PgTable, PgVector, TableConfig } from "drizzle-orm/pg-core";
import { db } from "..";

export interface QueryParams {
  limit?: number
  similarity?: number
}

export function createQuery<T extends TableConfig>(table: PgTable<T>) {
  const similar = (embedding: number[]) => sql<number>`1 - (${cosineDistance((table as any).embedding, embedding)})`

  return async (embedding: number[], params: QueryParams = {}) => {
    const similarity = similar(embedding)
    return await db
      .select({ similarity })
      .from(table)
      .where(gt(similar(embedding), params.similarity ?? 0.5))
      .orderBy(t => desc(t.similarity))
      .limit(params.limit ?? 10)
  }
}