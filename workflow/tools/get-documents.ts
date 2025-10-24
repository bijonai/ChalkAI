import { contential, type Knowledge } from "@chalk-dsl/knowledge";
import { tool } from "xsai";
import { z } from "zod";

export async function getDocuments(knowledge: Knowledge) {
  return await tool({
    name: 'get-documents',
    description: 'Get the documents by prefab name or calculator name.',
    parameters: z.object({
      prefabs: z.array(z.string()).describe('The prefab names.'),
      calculators: z.array(z.string()).describe('The calculator names.'),
    }),
    execute: async (input) => {
      const prefabs = knowledge.prefabs
        .filter(prefab => input.prefabs.includes(prefab.name))
        .map(prefab => contential.prefab(prefab))
      const calculators = knowledge.calculators.filter(calculator => input.calculators.includes(calculator.name))
      return {
        success: true,
        prefabs,
        calculators,
      }
    }
  })
}