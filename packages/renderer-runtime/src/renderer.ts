import { Component, createContext, BaseChalkElement, createAdhoc, effect, mergeContext, toProps, reactive, getRootSpace, ref, watch, computed, pauseTracking, resetTracking, AnimationItem } from "@chalk-dsl/renderer-core"
import { createErrorContainer, ElementNotFoundError } from "./error"
import patch from 'morphdom'
import { createDelegate } from "./delegate"
import { createAnimate } from "./animation"

export function createBox(components: Component<string>[]) {
  const { getActiveContext, setActiveContext, clearActiveContext, withContext, setValue, getValue } = createContext(reactive({}))
  const errors = createErrorContainer()
  const beginAnimations: (() => void)[] = []

  const renderComponent = (element: BaseChalkElement<string>): Node | null => {
    const component = components.find((component) => component.name === element.name)
    if (!component) {
      errors.addError({ name: "Element Not Found", message: `Element ${element.name} not found`, element } satisfies ElementNotFoundError)
      return null
    }
    if (!component.root) {
      return document.createTextNode('')
    }

    for (const reflection of Object.entries(component.refs ?? {})) {
      const [key, value] = reflection
      const _ref = ref()
      setValue(key, _ref)
      effect(() => {
        _ref.value = createAdhoc(getActiveContext())(value)
      })
    }

    // Set up default values to prevent undefined access
    component.root.attrs ??= {}
    component.root.events ??= {}
    component.root.statements ??= {}
    component.root.children ??= []

    const attrs = toProps(component.root.attrs, getActiveContext())
    return withContext(
      mergeContext(getActiveContext(), attrs),
      (): Node | null => renderElement(component.root!)
    )
  }

  const renderElement = (element: BaseChalkElement<string>): Node | null => {
    const pfbs = getRootSpace()
    const pfb = pfbs.get(element.name)
    if (!pfb) {
      return renderComponent(element)
    }
    const { name, validator, generator, provides, space } = pfb(getActiveContext())
    if (validator) {
      if (!validator()) {
        return null
      }
    }

    // Set up default values to prevent undefined access
    element.attrs ??= {}
    element.events ??= {}
    element.statements ??= {}
    element.children ??= []

    const children = element.children.map(renderNode).filter(child => child !== null && child !== undefined)
    const delegate = (node: Node, events: Record<string, string | Function>) => {
      const _delegate = createDelegate(node, getActiveContext())
      Object.entries(events).forEach(([event, handler]) => {
        _delegate(event, handler)
      })
      return _delegate
    }

    const node = generator(toProps(element.attrs, getActiveContext()), () => children)
    const resolveAnimations = <T extends Record<string, AnimationItem[]>>(animations: T) => {
      const results: Record<keyof T, () => void> = {} as Record<keyof T, () => void>
      for (const [key, value] of Object.entries(animations)) {
        const animate = () => createAnimate(getActiveContext(), { node, prefab: key })(value)
        if (key === '$start') {
          beginAnimations.push(animate)
          break
        }
        results[key as keyof T] = animate
      }
      return results
    }

    delegate(node, element.events)
    delegate(node, resolveAnimations(element.animations ?? {}))

    effect(() => {
      element.attrs ??= {}
      element.events ??= {}
      element.children ??= []
      const attrs = toProps(element.attrs, getActiveContext())
      const newNode = generator(attrs, () => children)
      delegate(newNode, element.events)
      delegate(newNode, resolveAnimations(element.animations ?? {}))
      patch(node, newNode)
      return newNode
    })

    return node
  }
  
  const renderValue = (source: string) => {
    const [, _] = source.split('{{')
    const [key, ..._rest] = _.split('}}')
    return _renderValue(key)
  }

  const _renderValue = (source: string) => {
    const text = document.createTextNode('')
    effect(() => text.nodeValue = createAdhoc(getActiveContext())(source).toString())
    return text
  }

  const renderText = (source: string) => {
    return /{{.+}}/.test(source) ? renderValue(source) : document.createTextNode(source)
  }

  const renderNode = (element: BaseChalkElement<string> | string) => {
    if (typeof element === 'string') {
      return renderText(element)
    }
    return renderElement(element)
  }

  const renderRoot = (root: string) => {
    const rootComp = components.find((component) => component.name === root)
    if (!rootComp) {
      return null
    }
    // Create a fake element to pass to renderComponent
    const fakeElement: BaseChalkElement<string> = {
      name: rootComp.name,
      attrs: {},
      events: {},
      statements: {},
      children: []
    }
    return renderComponent(fakeElement)
  }

  const render = (rootName: string, element: HTMLElement) => {
    (Array.from(element.children ?? [])).forEach(child => child.remove())
    const root = renderRoot(rootName)
    if (!root) return
    element.appendChild(root)
  }
  
  return {
    ...errors,
    render,
    renderRoot,
    renderElement,
    renderComponent,
    renderNode,
    renderText,
    renderValue,
    getActiveContext,
    setActiveContext,
    clearActiveContext,
    setValue,
    getValue,
  }
}