import { tool } from "xsai";
import { z } from "zod";
import type { Board } from "../../shared";


export default async function (board: Board) {
  return await tool({
    name: 'set-step',
    description: 'Set a step and return the id.',
    parameters: z.object({
      id: z.number().describe('The id of the STEP.'),
      component: z.string().describe('The name of the STEP COMPONENT.').optional(),
      description: z.string().describe('The description of the step.').optional(),
    }),
    execute: async ({ id, component, description }) => {
      board.steps[id] = { ...board.steps[id], component: component!, description: description! }
      return {
        success: true,
        id,
      }
    }
  })
}