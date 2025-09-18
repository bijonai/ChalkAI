import { tool } from "xsai";
import { Board } from "../../shared";
import { z } from "zod";
import { BaseChalkElement } from "@chalk-dsl/renderer-core";

const element = z.object({
  id: z.string().describe('The only-one id of the element instance.'),
  name: z.string().describe('The name of the element.'),
  attrs: z.record(z.string(), z.any()).describe('The attributes of the element.'),
  events: z.record(z.string(), z.any()).describe('The events of the element.'),
  statements: z.record(z.string(), z.any()).describe('The statements of the element.'),
  children: z.array(z.union([z.object(), z.string()])).describe('The children of the element.').optional(),
})

export async function setComponentRoot(board: Board) {
  return await tool({
    name: 'set-component-root',
    description: 'Set the root element of a component.',
    parameters: z.object({
      component: z.string().describe('The name of the component.'),
      element: element.describe('The element to set as the root.'),
    }),
    execute: async ({ component, element }) => {
      board.components[component].root = element as BaseChalkElement<string>
      return {
        success: true,
        component,
      }
    },
  })
}

export async function addChildren(board: Board) {
  return await tool({
    name: 'add-child',
    description: 'Add a child to an element.',
    parameters: z.object({
      component: z.string().describe('The name of the target component.'),
      element: element.describe('The element only-one id to add the child to.'),
      children: z.array(element).describe('The children to add.'),
    }),
    execute: async ({ component, element, children }) => {
      board.components[component].root!.children.push(...children)
      return {
        success: true,
        component,
      }
    },
  })
}

/**
 * TODO:
 * - addEvents
 * - addStatements
 * - addAttrs
 * - setEvent
 * - setStatement
 * - setAttr
 * - remove
 * - removeEvents
 * - removeStatements
 * - removeAttrs
 */
