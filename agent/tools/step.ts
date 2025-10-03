import type { Board } from "../../shared"
import { tool } from "xsai"
import { z } from "zod"

export async function newStep(board: Board) {
  return await tool({
    name: 'new-step',
    description: 'Create a new STEP and return the id.',
    parameters: z.object({
      description: z.string().describe('The description of the step.'),
      components: z.string().array().describe('The names of the STEP COMPONENT.'),
    }),
    execute: async ({ description, components }) => {
      board.steps.push({ components, description })
      return {
        success: true,
        id: board.steps.length,
      }
    }
  })
}

export async function addComponent(board: Board) {
  return await tool({
    name: 'add-component',
    description: 'Add a component to a step.',
    parameters: z.object({
      step: z.number().describe('The id of the step.'),
      component: z.string().describe('The name of the component.'),
    }),
    execute: async ({ step, component }) => {
      board.steps[step - 1].components.push(component)
      return {
        success: true,
        step,
      }
    }
  })
}
