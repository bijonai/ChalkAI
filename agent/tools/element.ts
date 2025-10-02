import { tool } from "xsai";
import type { Board } from "../../shared";
import { z } from "zod";
import type { BaseChalkElement, Component } from "@chalk-dsl/renderer-core";

const animation = z.object({
  preset: z.string().describe('The preset of the animation.'),
  params: z.record(z.string(), z.any()).describe('The params of the animation.'),
  duration: z.number().describe('The duration of the animation.'),
  easing: z.string().describe('The easing of the animation.').optional(),
  delay: z.number().describe('The delay of the animation.').optional(),
})
const animationItem = z.union([animation, z.array(animation)]).describe('Single animation will executed in order, animation list will executed in parallel.')
const animations = z.object({
  event: z.string().describe('Animate when event is triggered, if not set, animate when component is mounted.').optional(),
  animations: z.array(animationItem).describe('The animations of the element.'),
})

const element = z.object({
  id: z.string().describe('The only-one id of the element instance.'),
  name: z.string().describe('The name of the element.'),
  attrs: z.record(z.string(), z.any()).describe('The attributes of the element.').optional(),
  events: z.record(z.string(), z.any()).describe('The events of the element.').optional(),
  statements: z.record(z.string(), z.any()).describe('The statements of the element.').optional(),
  children: z.array(z.union([z.object(), z.string()])).describe('The children of the element.').optional(),
  animations: z.array(animations).describe('The animations of the element.').optional(),
})

const convertAnimation = (ani: z.infer<typeof animations>[]) => Object.fromEntries(
  ani.map(ani => [ani.event ?? '$start', ani.animations])
)
const convert = (ele: z.infer<typeof element>): BaseChalkElement<string> => {
  const result: BaseChalkElement<string> = {
    name: ele.name,
    id: ele.id,
  }

  if (ele.attrs) result.attrs = ele.attrs
  if (ele.events) result.events = ele.events
  if (ele.statements) result.statements = ele.statements
  if (ele.children && ele.children.length > 0) {
    result.children = ele.children as (BaseChalkElement<string> | string)[]
  }
  if (ele.animations && ele.animations.length > 0) {
    const convertedAnimations = convertAnimation(ele.animations)
    if (Object.keys(convertedAnimations).length > 0) {
      result.animations = convertedAnimations
    }
  }

  return result
}

export const findElement = (component: Component<string>, id: string) => {
  if (!component.root) return null
  const resolve = (element: BaseChalkElement<string>): BaseChalkElement<string> | null => {
    if (element.id === id) return element
    if (!element.children) return null
    return element.children.find(child => typeof child === 'string' ? null : resolve(child)) as BaseChalkElement<string> | null
  }
  return resolve(component.root)
}

const findComponent = (board: Board, comp: string) => {
  return board.components.find(component => component.name === comp)
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
      const target = findComponent(board, component)!
      if (!target) return {
        success: false,
        component,
        error: 'Component not found',
      }
      target.root = convert(element)
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
      element: z.string().describe('The element only-one id to add the child to.'),
      children: z.array(element).describe('The children to add.'),
    }),
    execute: async ({ component, element, children }) => {
      const target = findComponent(board, component)!
      if (!target) return {
        success: false,
        component,
        error: 'Component not found',
      }
      if (!target.root) return {
        success: false,
        component,
        error: 'Component root not found',
      }
      const elementTarget = findElement(target, element)
      if (!elementTarget) return {
        success: false,
        component,
        error: 'Element not found',
      }
      if (!elementTarget.children) {
        elementTarget.children = []
      }
      elementTarget.children.push(...children.map(convert))
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
      element: z.string().describe('The element only-one id to add the events to.'),
      events: z.array(z.object({
        event: z.string().describe('The event name to set.'),
        handler: z.string().describe('The handler of the event by JavaScript.'),
      })).describe('The events to add.'),
    }),
    execute: async ({ component, element, events }) => {
      const comp = findComponent(board, component)
      if (!comp) return {
        success: false,
        component,
        error: 'Component not found',
      }
      const target = findElement(comp, element)
      if (!target) return {
        success: false,
        component,
        error: 'Element not found',
      }
      if (!target.events) {
        target.events = {}
      }
      target.events = { ...target.events, ...Object.fromEntries(events.map(event => [event.event, event.handler])) }
      return {
        success: true,
        component,
        element,
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
      element: z.string().describe('The element only-one id to add the attributes to.'),
      attrs: z.array(z.object({
        key: z.string().describe('The attribute name to set.'),
        value: z.any().describe('The value of the attribute.'),
      })).describe('The attributes to set.'),
    }),
    execute: async ({ component, element, attrs }) => {
      const comp = findComponent(board, component)
      if (!comp) return {
        success: false,
        component,
        error: 'Component not found',
      }
      const target = findElement(comp, element)
      if (!target) return {
        success: false,
        component,
        error: 'Element not found',
      }
      if (!target.attrs) {
        target.attrs = {}
      }
      target.attrs = { ...target.attrs, ...Object.fromEntries(attrs.map(attr => [attr.key, attr.value])) }
      return {
        success: true,
        component,
        element,
      }
    },
  })
}

export async function setAnimations(board: Board) {
  return await tool({
    name: 'set-animations',
    description: 'set animations to an element or add if not exists.',
    parameters: z.object({
      component: z.string().describe('The name of the target component.'),
      element: z.string().describe('The element only-one id to add the animations to.'),
      animations: z.array(animations).describe('The animations to set.'),
    }),
    execute: async ({ component, element, animations }) => {
      const comp = findComponent(board, component)
      if (!comp) return {
        success: false,
        component,
        error: 'Component not found',
      }
      const target = findElement(comp, element)
      if (!target) return {
        success: false,
        component,
        error: 'Element not found',
      }
      if (!target.animations) {
        target.animations = {}
      }
      target.animations = { ...target.animations, ...convertAnimation(animations) }
      return {
        success: true,
        component,
        element,
      }
    },
  })
}

export async function setStatements(board: Board) {
  return await tool({
    name: 'set-statements',
    description: 'set statements to an element or add if not exists.',
    parameters: z.object({
      component: z.string().describe('The name of the target component.'),
      element: z.string().describe('The element only-one id to add the statements to.'),
      statements: z.array(z.object({
        key: z.string().describe('The statement name to set.'),
        value: z.any().describe('The value of the statement.'),
      })).describe('The statements to set.'),
    }),
    execute: async ({ component, element, statements }) => {
      const comp = findComponent(board, component)
      if (!comp) return {
        success: false,
        component,
        error: 'Component not found',
      }
      const target = findElement(comp, element)
      if (!target) return {
        success: false,
        component,
        error: 'Element not found',
      }
      if (!target.statements) {
        target.statements = {}
      }
      target.statements = { ...target.statements, ...Object.fromEntries(statements.map(statement => [statement.key, statement.value])) }
      return {
        success: true,
        component,
        element,
      }
    }
  })
}

export async function remove(board: Board) {
  return await tool({
    name: 'remove',
    description: 'remove an element.',
    parameters: z.object({
      component: z.string().describe('The name of the target component.'),
      element: z.string().describe('The element only-one id to remove.'),
    }),
    execute: async ({ component, element }) => {
      const comp = findComponent(board, component)
      if (!comp) return {
        success: false,
        component,
        error: 'Component not found',
      }
      const target = findElement(comp, element)
      if (!target) return {
        success: false,
        component,
        error: 'Element not found',
      }
      if (target.children) {
        target.children = target.children.filter(child => typeof child === 'string' ? child !== element : child.id !== element)
      }
      return {
        success: true,
        component,
        element,
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
      element: z.string().describe('The element only-one id to remove the events from.'),
      events: z.array(z.string()).describe('The events to remove.'),
    }),
    execute: async ({ component, element, events }) => {
      const comp = findComponent(board, component)
      if (!comp) return {
        success: false,
        component,
        error: 'Component not found',
      }
      const target = findElement(comp, element)
      if (!target) return {
        success: false,
        component,
        error: 'Element not found',
      }
      if (target.events) {
        target.events = Object.fromEntries(Object.entries(target.events).filter(([event]) => !events.includes(event)))
      }
      return {
        success: true,
        component,
        element,
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
      element: z.string().describe('The element only-one id to remove the attrs from.'),
      attrs: z.array(z.string()).describe('The attrs to remove.'),
    }),
    execute: async ({ component, element, attrs }) => {
      const comp = findComponent(board, component)
      if (!comp) return {
        success: false,
        component,
        error: 'Component not found',
      }
      const target = findElement(comp, element)
      if (!target) return {
        success: false,
        component,
        error: 'Element not found',
      }
      if (target.attrs) {
        target.attrs = Object.fromEntries(Object.entries(target.attrs).filter(([attr]) => !attrs.includes(attr)))
      }
      return {
        success: true,
        component,
        element,
      }
    },
  })
}

export async function removeAnimations(board: Board) {
  return await tool({
    name: 'remove-animations',
    description: 'remove animations of an element.',
    parameters: z.object({
      component: z.string().describe('The name of the target component.'),
      element: z.string().describe('The element only-one id to remove the animations from.'),
      animations: z.array(z.string()).describe('The animations to remove, if not set, remove animation when component is mounted.').optional(),
    }),
    execute: async ({ component, element, animations }) => {
      const comp = findComponent(board, component)
      if (!comp) return {
        success: false,
        component,
        error: 'Component not found',
      }
      const target = findElement(comp, element)
      if (!target) return {
        success: false,
        component,
        error: 'Element not found',
      }
      if (!target.animations) {
        target.animations = {}
      }
      if (!animations) {
        target.animations['$start'] = []
      } else {
        target.animations = Object.fromEntries(Object.entries(target.animations).filter(([key]) => !animations.includes(key)))
      }
      return {
        success: true,
        component,
        element,
      }
    },
  })
}

export async function removeStatements(board: Board) {
  return await tool({
    name: 'remove-statements',
    description: 'remove statements of an element.',
    parameters: z.object({
      component: z.string().describe('The name of the target component.'),
      element: z.string().describe('The element only-one id to remove the statements from.'),
      statements: z.array(z.string()).describe('The statements to remove.'),
    }),
    execute: async ({ component, element, statements }) => {
      const comp = findComponent(board, component)
      if (!comp) return {
        success: false,
        component,
        error: 'Component not found',
      }
      const target = findElement(comp, element)
      if (!target) return {
        success: false,
        component,
        error: 'Element not found',
      }
      if (target.statements) {
        target.statements = Object.fromEntries(Object.entries(target.statements).filter(([key]) => !statements.includes(key)))
      }
      return {
        success: true,
        component,
        element,
      }
    }
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
