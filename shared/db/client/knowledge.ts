import { eq } from "drizzle-orm"
import { db } from ".."
import { knowledgeTable } from "../schema/knowledge"
import type { CalculatorKnowledge, Knowledge, PrefabKnowledge } from "@chalk-dsl/knowledge"

export const createKnowledge = async (name: string, description?: string) => {
  const [knowledge] = await db.insert(knowledgeTable).values({
    name,
    description,
  }).returning({ id: knowledgeTable.id, name: knowledgeTable.name, description: knowledgeTable.description })
  return {
    success: true,
    data: knowledge,
  } as const
}

export const setKnowledge = async (id: string, knowledge: {
  prefabs: PrefabKnowledge[]
  calculators: CalculatorKnowledge[]
}, by: 'id' | 'name' = 'name') => {
  const result = await db.update(knowledgeTable).set({
    prefabs: knowledge.prefabs,
    calculators: knowledge.calculators,
  }).where(by === 'id' ? eq(knowledgeTable.id, id) : eq(knowledgeTable.name, id))
    .returning({ id: knowledgeTable.id, name: knowledgeTable.name, description: knowledgeTable.description })
  
  return {
    success: true,
    data: result.at(0)!,
  }
}

export const getKnowledge = async (id: string, by: 'id' | 'name' = 'name') => {
  const result = await db.select({ prefabs: knowledgeTable.prefabs, calculators: knowledgeTable.calculators })
    .from(knowledgeTable)
    .where(by === 'id' ? eq(knowledgeTable.id, id) : eq(knowledgeTable.name, id))
    .then(r => r.at(0) ?? null)
  return {
    success: true,
    data: result as Knowledge | null,
  }
}
