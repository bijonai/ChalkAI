import { embed, tool } from "xsai"
import { createQuery } from "../../shared/db/client"
import { z } from "zod"
import { prefabKnowledgeTable } from "../../shared/db/schema"

export async function search({ model, apiKey, baseURL }: {
  model: string
  apiKey: string
  baseURL: string
}) {
  return await tool({
    name: 'search',
    description: 'Search the knowledge with Embedding.',
    parameters: z.object({
      input: z.string().describe('The query to search the knowledge.'),
    }),
    execute: async ({ input }) => {
      const { embedding } = await embed({
        model,
        apiKey,
        baseURL,
        input,
      })
      const results = await Promise.all([
        createQuery(prefabKnowledgeTable)(embedding),
      ])
      return {
        success: true,
        result: results.flat(),
      }
    }
  })
}
