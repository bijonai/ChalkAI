import { embed, tool } from "xsai"
import { createQuery } from "../../shared/db/client"
import { z } from "zod"
import { prefabKnowledgeTable } from "../../shared/db/schema"

export async function query({ model, apiKey, baseURL, types }: {
  model: string
  apiKey: string
  baseURL: string
  types: ('prefab' | 'calculator')[]
}) {
  const havePrefab = types.includes('prefab')
  const haveCalculator = types.includes('calculator')
  const name = () => haveCalculator && havePrefab
    ? 'query'
    : haveCalculator
      ? 'query-calculator'
      : havePrefab
        ? 'query-prefab'
        : 'query'
  return await tool({
    name: name(),
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
