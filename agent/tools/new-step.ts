import type { Board } from "../../shared"
import { tool } from "xsai"
import { z } from "zod"

export default async function (board: Board) {
  return await tool({
    name: 'new-step',
    description: 'Create a new STEP and return the id.',
    parameters: z.object({
      description: z.string().describe('The description of the step.'),
      component: z.string().describe('The name of the STEP COMPONENT.'),
    }),
    execute: async ({ description, component }) => {
      board.steps.push({ component, description })
      return {
        success: true,
        id: board.steps.length,
      }
    }
  })
}