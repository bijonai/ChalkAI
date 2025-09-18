import { Component, createContext, BaseChalkElement, createAdhoc, effect, mergeContext, toProps, reactive } from "@chalk-dsl/renderer-core"
import { BoxError, createErrorContainer, ElementNotFoundError } from "./error"
import patch from 'morphdom'

export function createBox(components: Component<string>[], root: string = 'Root') {
  const { getActiveContext, setActiveContext, clearActiveContext, withContext } = createContext(reactive({}))
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
          patch(node, newNode)
          return newNode
        }
      )
    })
    return node
  }

  const renderElement = (element: BaseChalkElement<string>) => {
    return document.createElement('empty')
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

  const render = () => { }
  
  return {
    ...errors,
  }
}