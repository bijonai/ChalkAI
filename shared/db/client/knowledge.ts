import type { PrefabKnowledge } from "@chalk-dsl/knowledge";
import { db } from "..";
import { prefabKnowledgeTable } from "../schema";

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