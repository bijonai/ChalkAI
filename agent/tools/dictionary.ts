import type { Knowledge } from "@chalk-dsl/knowledge"
import { getTags as _getTags, getPrefabsByTag } from "@chalk-dsl/knowledge"
import { tool } from "xsai"
import { z } from "zod"

export async function getTags(knowledge: Knowledge) {
  return await tool({
    name: 'get-tags',
    description: 'Get the tags of the knowledge.',
    parameters: z.object({
      _: z.string()
    }),
    execute: async () => {
      return {
        success: true,
        tags: _getTags(knowledge.prefabs),
      }
    }
  })
}

export async function getPrefabDocumentByTag(knowledge: Knowledge) {
  return await tool({
    name: 'get-prefab-document-by-tag',
    description: 'Get the prefab document by tag.',
    parameters: z.object({
      tag: z.string(),
    }),
    execute: async ({ tag }) => {
      return {
        success: true,
        prefab: getPrefabsByTag(knowledge.prefabs, tag),
      }
    }
  })
}
