import { tool } from "xsai";
import { z } from "zod";
import type { Board } from "../../shared";

export async function createRef(board: Board) {
  return await tool({
    name: 'create-ref',
    description: 'Create a new reflection variable and return the id.',
    parameters: z.object({
      component: z.string().describe('The name of the target component.'),
      name: z.string().describe('The name of the reflection variable.'),
      value: z.string().describe('The JavaScript expression of the reflection variable.'),
    }),
    execute: async ({ component, name, value }) => {
      const target = board.components.find(comp => comp.name === component)
      if (!target) {
        return {
          success: false,
          error: 'Component not found.',
        }
      }
      target.refs ??= {}
      target.refs[name] = value
      return {
        success: true,
        name,
        component,
      }
    }
  })
}