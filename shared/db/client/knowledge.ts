import type { CalculatorKnowledge, CalculatorKnowledgeArgument, Knowledge, PrefabKnowledge, PrefabKnowledgeProp } from "@chalk-dsl/knowledge";
import { db } from "..";
import { calculatorKnowledgeTable, prefabKnowledgeTable } from "../schema";

export const setPrefabKnowledge = async (prefab: PrefabKnowledge, embedding: number[]) => {
  // console.log(embedding.length)
  return await db.insert(prefabKnowledgeTable)
    .values({
      name: prefab.name,
      description: prefab.description,
      tags: prefab.tags,
      props: prefab.props,
      examples: prefab.examples,
      rules: prefab.rules,
      slots: prefab.slots,
      embedding,
    })
    .onConflictDoUpdate({
      target: prefabKnowledgeTable.name,
      set: {
        description: prefab.description,
        tags: prefab.tags,
        props: prefab.props,
        examples: prefab.examples,
        rules: prefab.rules,
        slots: prefab.slots,
        embedding,
      },
    })
    .returning({ id: prefabKnowledgeTable.id, name: prefabKnowledgeTable.name })
}

export const setCalculatorKnowledge = async (calculator: CalculatorKnowledge, embedding: number[]) => {
  return await db.insert(calculatorKnowledgeTable)
    .values({
      name: calculator.name,
      description: calculator.description,
      args: calculator.args,
      return: calculator.return,
      raw: calculator.raw,
      embedding,
    })
    .onConflictDoUpdate({
      target: calculatorKnowledgeTable.name,
      set: {
        description: calculator.description,
        args: calculator.args,
        return: calculator.return,
        raw: calculator.raw,
        embedding,
      },
    })
    .returning({ id: calculatorKnowledgeTable.id, name: calculatorKnowledgeTable.name })
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
      examples: r.examples,
      rules: r.rules,
      slots: r.slots as [string, string][],
    }
  })
  const calculatorQuery = await db.select()
    .from(calculatorKnowledgeTable)
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
