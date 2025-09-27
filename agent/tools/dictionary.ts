import type { Knowledge } from "@chalk-dsl/knowledge"
import { getTags as _getTags, getPrefabsByTag, getCalculators as _getCalculators } from "@chalk-dsl/knowledge"
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

export async function getPrefab(knowledge: Knowledge) {
  return await tool({
    name: 'get-prefab',
    description: 'Get the prefab document by name.',
    parameters: z.object({
      name: z.string(),
    }),
    execute: async ({ name }) => {
      return {
        success: true,
        prefab: knowledge.prefabs.find((prefab) => prefab.name === name),
      }
    }
  })
}

export async function getCalculators(knowledge: Knowledge) {
  return await tool({
    name: 'get-calculators',
    description: 'Get the calculators of the knowledge.',
    parameters: z.object({
      _: z.string()
    }),
    execute: async () => {
      return {
        success: true,
        calculators: _getCalculators(knowledge.calculators),
      }
    }
  })
}

export async function getCalculator(knowledge: Knowledge) {
  return await tool({
    name: 'get-calculator',
    description: 'Get the calculator document by tag.',
    parameters: z.object({
      name: z.string(),
    }),
    execute: async ({ name }) => {
      return {
        success: true,
        calculator: knowledge.calculators.find((calculator) => calculator.name === name),
      }
    }
  })
}
