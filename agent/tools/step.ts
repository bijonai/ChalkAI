import { type Board } from "../../shared";
import { tool } from "xsai";
import { z } from "zod";

export async function setSteps(board: Board) {
  return await tool({
    name: 'set-steps',
    description: 'Set the steps of the course.',
    parameters: z.object({
      steps: z.array(z.object({
        description: z.string().describe('The description of the step.'),
        components: z.array(z.string()).describe('The components of the step.'),
        conditional: z.boolean().describe('Whether the step is conditional'),
      })).describe('The steps of the course in order.'),
    }),
    execute: async ({ steps }) => {
      board.steps = steps
      return {
        success: true,
      }
    },
  })
}