import type { CalculatorKnowledge, PrefabKnowledge } from "@chalk-dsl/knowledge";
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
      embedding,
    })
    .onConflictDoUpdate({
      target: prefabCalculatorTable.name,
      set: {
        description: calculator.description,
        args: calculator.args,
        return: calculator.return,
        embedding,
      },
    })
    .returning({ id: prefabCalculatorTable.id, name: prefabCalculatorTable.name })
}
