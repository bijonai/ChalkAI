import { Component, createContext, BaseChalkElement, createAdhoc, effect, mergeContext, toProps, reactive, getRootSpace } from "@chalk-dsl/renderer-core"
import { createErrorContainer, ElementNotFoundError } from "./error"
import patch from 'morphdom'

export function createBox(components: Component<string>[], root: string = 'Root') {
  const { getActiveContext, setActiveContext, clearActiveContext, withContext, setValue, getValue } = createContext(reactive({}))
  const errors = createErrorContainer()

  const renderComponent = (element: BaseChalkElement<string>) => {
    const component = components.find((component) => component.name === element.name)
    if (!component) {
      errors.addError({ name: "Element Not Found", message: `Element ${element.name} not found`, element } satisfies ElementNotFoundError)
      return
    }
    const node = document.createElement('fragment')
    effect(() => {
      const attrs = toProps(element.attrs, getActiveContext())
      withContext(
        mergeContext(getActiveContext(), attrs),
        () => {
          const newNode = renderElement(element)
          if (!newNode) return
          patch(node, newNode)
          return newNode
        }
      )
    })
    return node
  }

  const renderElement = (element: BaseChalkElement<string>) => {
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
    const children = element.children.map(renderNode).filter(child => child !== null && child !== undefined)
    const node = generator(toProps(element.attrs, getActiveContext()), () => children)
    effect(() => {
      const newNode = generator(toProps(element.attrs, getActiveContext()), () => children)
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

  const renderRoot = () => {
    const rootComp = components.find((component) => component.name === root)
    if (!rootComp) {
      return null
    }
    return renderNode(rootComp.root)
  }

  const render = (element: HTMLElement) => {
    (Array.from(element.children)).forEach(child => child.remove())
    const root = renderRoot()
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