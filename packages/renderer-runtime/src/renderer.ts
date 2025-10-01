import { Component, createContext, BaseChalkElement, createAdhoc, effect, mergeContext, toProps, reactive, getRootSpace, ref, AnimationItem, createErrorContainer, getStatement, StatementPreGenerator, StatementPostGenerator } from "@chalk-dsl/renderer-core"
import { ElementNotFoundError } from "./error"
import patch from 'morphdom'
import { createDelegate } from "./delegate"
import { createAnimate } from "./animation"
import { createMarkdown } from "./builtins/markdown"

export const toArray = <T>(value: T | T[]): T[] => Array.isArray(value) ? value : [value]

export function createBox(components: Component<string>[]) {
  const { getActiveContext, setActiveContext, clearActiveContext, withContext, setValue, getValue } = createContext(reactive({}))
  const errors = createErrorContainer()
  const beginAnimations: (() => void)[] = []
  const markdown = createMarkdown()

  const renderComponent = (element: BaseChalkElement<string>): Node | Node[] | null => {
    const component = components.find((component) => component.name === element.name)
    if (!component) {
      errors.addError({ name: "Element Not Found", message: `Element ${element.name} not found`, element } satisfies ElementNotFoundError)
      return null
    }
    if (!component.root) {
      return document.createTextNode('')
    }

    const refs = Object.entries(component.refs ?? {})
    const retryWaitlist: string[] = []
    const resolve = (key: string, value: string, retrying: boolean = false) => {
      const _ref = ref()
      setValue(key, _ref)
      effect(() => {
        try {
          _ref.value = createAdhoc(getActiveContext())(value)
          if (retryWaitlist.includes(key)) {
            retryWaitlist.splice(retryWaitlist.indexOf(key), 1)
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          if (retrying) return
          retryWaitlist.push(key)
        }
        if (retrying) return
        for (const key of retryWaitlist) {
          resolve(key, component.refs![key], true)
        }
      })
    }
    for (const reflection of refs) {
      const [key, value] = reflection
      resolve(key, value)
    }

    // Set up default values to prevent undefined access
    component.root.attrs ??= {}
    component.root.events ??= {}
    component.root.statements ??= {}
    component.root.children ??= []

    const attrs = toProps(component.root.attrs, getActiveContext())
    return withContext(
      mergeContext(getActiveContext(), attrs),
      (): Node | Node[] | null => renderElement(component.root!)
    )
  }

  const renderElement = (element: BaseChalkElement<string>): Node | Node[] | null => {
    const pfbs = getRootSpace()
    console.log(pfbs)
    const pfb = pfbs.get(element.name)
    if (!pfb) {
      return renderComponent(element)
    }
    const { name, validator, generator, provides, defaults } = pfb(getActiveContext(), errors.addError)
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

    const delegate = (node: Node, events: Record<string, string | (() => void)>) => {
      const _delegate = createDelegate(node, getActiveContext())
      Object.entries(events).forEach(([event, handler]) => {
        _delegate(event, handler)
      })
      return _delegate
    }
    const statementResolvers: { pre?: StatementPreGenerator, post?: StatementPostGenerator }[]
      = Object.entries(element.statements ?? {}).map(([key, value]) => {
        const statement = getStatement(key)! // TODO: Handle errors
        return statement(value)
      }).filter(Boolean)
    element.statements = {}

    for (const { pre } of statementResolvers) {
      if (!pre) continue
      const newElement = pre(getActiveContext(), element)
      Object.assign(element, newElement)
    }

    for (const { post } of statementResolvers) {
      if (!post) continue
      return post(getActiveContext(), element, (element, contextOverride) => {
        if (contextOverride) {
          return withContext(contextOverride, () => renderNode(element))
        }
        return renderNode(element)
      })
    }

    const children = withContext(
      mergeContext(getActiveContext(), provides ?? {}),
      () => (element.children ?? []).flatMap(renderNode).filter(child => child !== null && child !== undefined)
    )

    const node = generator(
      {...defaults, ...toProps(element.attrs, getActiveContext())},
      () => children)
    const resolveAnimations = <T extends Record<string, AnimationItem[]>>(animations: T) => {
      const results: Record<keyof T, () => void> = {} as Record<keyof T, () => void>
      for (const [key, value] of Object.entries(animations)) {
        const animate = () => createAnimate(getActiveContext(), { node, prefab: name })(value)
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
      const newNode = generator({...defaults, ...attrs}, () => children)
      delegate(newNode, element.events)
      delegate(newNode, resolveAnimations(element.animations ?? {}))
      patch(node, newNode)
      return newNode
    })

    return node
  }
  
  const renderValue = (source: string) => {
    const [, _] = source.split('{{')
    const [key] = _.split('}}')
    return _renderValue(key)
  }

  const _renderValue = (source: string) => {
    const adhoc = createAdhoc(getActiveContext())
    return adhoc(source).toString()
  }

  const renderText = (source: string) => {
    const text = document.createElement('span')
    effect(() => {
      const value = source.replace(/{{(.*?)}}/g, (match, key) => {
        // 去除首尾空格
        return _renderValue(key.trim())
      })
      text.innerHTML = markdown(value)
    })
    return text
  }

  const renderNode = (element: BaseChalkElement<string> | string) => {
    if (typeof element === 'string') {
      return renderText(element)
    }
    console.log(element, getActiveContext())
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
    element.append(...toArray(root))
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
    beginAnimations,
  }
}