import type { CalculatorKnowledge, CalculatorKnowledgeArgument, Knowledge, PrefabKnowledge, PrefabKnowledgeProp } from "@chalk-dsl/knowledge";
import { db } from "..";
import { prefabCalculatorTable, prefabKnowledgeTable } from "../schema";

export const setPrefabKnowledge = async (prefab: PrefabKnowledge, embedding: number[]) => {
  // console.log(embedding.length)
  return await db.insert(prefabKnowledgeTable)
    .values({
      name: prefab.name,
      description: prefab.description,
      tags: prefab.tags,
      props: prefab.props,
      embedding,
    })
    .onConflictDoUpdate({
      target: prefabKnowledgeTable.name,
      set: {
        description: prefab.description,
        tags: prefab.tags,
        props: prefab.props,
        embedding,
      },
    })
    .returning({ id: prefabKnowledgeTable.id, name: prefabKnowledgeTable.name })
}

export const setCalculatorKnowledge = async (calculator: CalculatorKnowledge, embedding: number[]) => {
  return await db.insert(prefabCalculatorTable)
    .values({
      name: calculator.name,
      description: calculator.description,
      args: calculator.args,
      return: calculator.return,
      raw: calculator.raw,
      embedding,
    })
    .onConflictDoUpdate({
      target: prefabCalculatorTable.name,
      set: {
        description: calculator.description,
        args: calculator.args,
        return: calculator.return,
        raw: calculator.raw,
        embedding,
      },
    })
    .returning({ id: prefabCalculatorTable.id, name: prefabCalculatorTable.name })
}

export const getToKnowledges = async (): Promise<Knowledge> => {
  const prefabQuery = await db.select()
    .from(prefabKnowledgeTable)
  const prefabs: PrefabKnowledge[] = prefabQuery.map(r => {
    return {
      name: r.name,
      description: r.description,
      tags: r.tags,
      props: r.props as PrefabKnowledgeProp[],
    }
  })
  const calculatorQuery = await db.select()
    .from(prefabCalculatorTable)
  const calculators: CalculatorKnowledge[] = calculatorQuery.map(r => {
    return {
      name: r.name,
      description: r.description,
      args: r.args as CalculatorKnowledgeArgument[],
      return: r.return as [string, string?],
      raw: r.raw,
    }
  })
  return {
    prefabs,
    calculators,
  } satisfies Knowledge
}
