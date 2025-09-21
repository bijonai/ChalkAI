import { tool } from "xsai";
import { z } from "zod";
import type { Board } from "../../shared";

export default async function (board: Board) {
  return await tool({
    name: 'create-component',
    description: 'Create a new COMPONENT and return the id.',
    parameters: z.object({
      name: z.string().describe('The name of the COMPONENT.'),
      props: z.array(z.string()).describe('The props of the COMPONENT.'),
    }),
    execute: async ({ name, props }) => {
      board.components.push({ name, props })
      return {
        success: true,
        name,
      }
    }
  })
}