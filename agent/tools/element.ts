import { tool } from "xsai";
import { Board } from "../../shared";
import { z } from "zod";
import { BaseChalkElement, Component } from "@chalk-dsl/renderer-core";

const element = z.object({
  id: z.string().describe('The only-one id of the element instance.'),
  name: z.string().describe('The name of the element.'),
  attrs: z.record(z.string(), z.any()).describe('The attributes of the element.'),
  events: z.record(z.string(), z.any()).describe('The events of the element.'),
  statements: z.record(z.string(), z.any()).describe('The statements of the element.'),
  children: z.array(z.union([z.object(), z.string()])).describe('The children of the element.').optional(),
})

export const findElement = (component: Component<string>, id: string) => {
  if (!component.root) return null
  const resolve = (element: BaseChalkElement<string>): BaseChalkElement<string> | null => {
    if (element.id === id) return element
    element.children ??= []
    return element.children.find(child => typeof child === 'string' ? null : resolve(child)) as BaseChalkElement<string> | null
  }
  return resolve(component.root)
}

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

export async function setEvents(board: Board) {
  return await tool({
    name: 'set-events',
    description: 'set events to an element or add if not exists.',
    parameters: z.object({
      component: z.string().describe('The name of the target component.'),
      element: element.describe('The element only-one id to add the events to.'),
      events: z.array(z.object({
        event: z.string().describe('The event name to set.'),
        handler: z.string().describe('The handler of the event by JavaScript.'),
      })).describe('The events to add.'),
    }),
    execute: async ({ component, element, events }) => {
      const target = findElement(board.components[component], element.id)
      if (!target) return {
        success: false,
        component,
        error: 'Element not found',
      }
      target.events = { ...target.events, ...Object.fromEntries(events.map(event => [event.event, event.handler])) }
      return {
        success: true,
        component,
        element: element.id,
      }
    },
  })
}

export async function setAttrs(board: Board) {
  return await tool({
    name: 'set-attrs',
    description: 'set attributes to an element or add if not exists.',
    parameters: z.object({
      component: z.string().describe('The name of the target component.'),
      element: element.describe('The element only-one id to add the attributes to.'),
      attrs: z.array(z.object({
        key: z.string().describe('The attribute name to set.'),
        value: z.any().describe('The value of the attribute.'),
      })).describe('The attributes to set.'),
    }),
    execute: async ({ component, element, attrs }) => {
      const target = findElement(board.components[component], element.id)
      if (!target) return {
        success: false,
        component,
        error: 'Element not found',
      }
      target.attrs = { ...target.attrs, ...Object.fromEntries(attrs.map(attr => [attr.key, attr.value])) }
      return {
        success: true,
        component,
        element: element.id,
      }
    },
  })
}

export async function remove(board: Board) {
  return await tool({
    name: 'remove',
    description: 'remove an element.',
    parameters: z.object({
      component: z.string().describe('The name of the target component.'),
      element: element.describe('The element only-one id to remove.'),
    }),
    execute: async ({ component, element }) => {
      const target = findElement(board.components[component], element.id)
      if (!target) return {
        success: false,
        component,
        error: 'Element not found',
      }
      target.children ??= []
      target.children = target.children.filter(child => typeof child === 'string' ? child !== element.id : child.id !== element.id)
      return {
        success: true,
        component,
        element: element.id,
      }
    },
  })
}

export async function removeEvents(board: Board) {
  return await tool({
    name: 'remove-events',
    description: 'remove events of an element.',
    parameters: z.object({
      component: z.string().describe('The name of the target component.'),
      element: element.describe('The element only-one id to remove the events from.'),
      events: z.array(z.string()).describe('The events to remove.'),
    }),
    execute: async ({ component, element, events }) => {
      const target = findElement(board.components[component], element.id)
      if (!target) return {
        success: false,
        component,
        error: 'Element not found',
      }
      target.events ??= {}
      target.events = Object.fromEntries(Object.entries(target.events).filter(([event]) => !events.includes(event)))
      return {
        success: true,
        component,
        element: element.id,
      }
    },
  })
}

export async function removeAttrs(board: Board) {
  return await tool({
    name: 'remove-attrs',
    description: 'remove attrs of an element.',
    parameters: z.object({
      component: z.string().describe('The name of the target component.'),
      element: element.describe('The element only-one id to remove the attrs from.'),
      attrs: z.array(z.string()).describe('The attrs to remove.'),
    }),
    execute: async ({ component, element, attrs }) => {
      const target = findElement(board.components[component], element.id)
      if (!target) return {
        success: false,
        component,
        error: 'Element not found',
      }
      target.attrs ??= {}
      target.attrs = Object.fromEntries(Object.entries(target.attrs).filter(([attr]) => !attrs.includes(attr)))
      return {
        success: true,
        component,
        element: element.id,
      }
    },
  })
}

/**
 * TODO:
 * - setEvents [x]
 * - setStatements [ ]
 * - setAttrs [x]
 * - remove [x]
 * - removeEvents [x]
 * - removeStatements [ ]
 * - removeAttrs [x]
 */
