import { Component, createContext, BaseChalkElement, createAdhoc, effect, mergeContext, toProps, reactive, getRootSpace, ref, AnimationItem, createErrorContainer, getStatement, StatementPreGenerator, StatementPostGenerator, Attributes, Origin, PrefabGeneratorContext, PrefabDefinition, RawContext } from "@chalk-dsl/renderer-core"
import { ElementNotFoundError } from "./error"
import { createDelegate } from "./delegate"
import { createAnimate } from "./animation"
import { createMarkdown } from "./builtins/markdown"
import patch from 'morphdom'

export const toArray = <T>(value: T | T[]): T[] => Array.isArray(value) ? value : [value]

export function createBox(components: Component<string>[]) {
  const { getActiveContext, setActiveContext, clearActiveContext, withContext, setValue, getValue } = createContext(reactive({}))
  const errors = createErrorContainer()
  const beginAnimations: (() => void)[] = []
  const markdown = createMarkdown()

  const mountQueue: (() => void)[] = []
  const onMount = (callback: () => void) => {
    mountQueue.push(callback)
  }

  const preprocessElement = (element: BaseChalkElement<string>, parent?: BaseChalkElement<string>) => {
    // Merge consecutive string children with newline separators
    if (element.children && element.children.length > 0) {
      const mergedChildren: (BaseChalkElement<string> | string)[] = []
      let currentStringGroup: string[] = []

      for (const child of element.children) {
        if (typeof child === 'string') {
          currentStringGroup.push(child)
        } else {
          // If we have accumulated string children, merge them
          if (currentStringGroup.length > 0) {
            mergedChildren.push(currentStringGroup.join('\n'))
            currentStringGroup = []
          }
          // Process non-string child recursively
          preprocessElement(child, element)
          mergedChildren.push(child)
        }
      }

      // Handle any remaining string children at the end
      if (currentStringGroup.length > 0) {
        mergedChildren.push(currentStringGroup.join('\n'))
      }

      element.children = mergedChildren
    }

    element.parent = parent
  }

  const renderComponent = (element: BaseChalkElement<string>): Node | Node[] | null => {
    const component = components.find((component) => component.name === element.name)
    if (!component) {
      errors.addError({ name: "Element Not Found", message: `Element ${element.name} not found`, element } satisfies ElementNotFoundError)
      return null
    }
    if (!component.root) {
      return document.createTextNode('')
    }
    const roots = toArray(component.root)
    for (const root of roots) {
      preprocessElement(root)
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
    return roots.flatMap(root => {
      root.attrs ??= {}
      root.events ??= {}
      root.statements ??= {}
      root.children ??= []

      const attrs = toProps(root.attrs, getActiveContext())
      return withContext(
        mergeContext(getActiveContext(), attrs),
        (): Node | Node[] | null => renderElement(root!)
      )
    }) as Node[]
  }

  const renderPrefab = (
    element: BaseChalkElement<string>,
    props: RawContext,
    { name, validator, generator, provides, defaults }: PrefabDefinition<string>
  ) => {
    // Set up default values to prevent undefined access
    element.attrs ??= {}
    element.events ??= {}
    element.statements ??= {}
    element.children ??= []

    if (validator) {
      if (!validator()) {
        return null
      }
    }

    const delegate = (node: Node, events: Record<string, string | (() => void)>) => {
      const _delegate = createDelegate(node, getActiveContext())
      Object.entries(events).forEach(([event, handler]) => {
        _delegate(event, handler)
      })
      return _delegate
    }
    const statementResolvers: { pre?: StatementPreGenerator, post?: StatementPostGenerator }[]
      = Object.entries(element.statements ?? {}).map(([key, value]) => {
        const statement = getStatement(key)
        if (!statement) {
          if (key.startsWith('#')) return null
          errors.addError({ name: "Statement Not Found", message: `Statement ${key} not found`, element })
          return null
        }
        return statement(value)
      }).filter(Boolean) as { pre?: StatementPreGenerator, post?: StatementPostGenerator }[]

    for (const { pre } of statementResolvers) {
      if (!pre) continue
      return pre(getActiveContext(), element, (element, contextOverride) => {
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

    const generatorContext: PrefabGeneratorContext = {
      mount: onMount,
    }

    const node = generator(
      { ...defaults, ...props },
      () => children, generatorContext)
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
    for (const { post } of statementResolvers) {
      if (!post) continue
      return post(getActiveContext(), element, node)
    }

    delegate(node, element.events)
    delegate(node, resolveAnimations(element.animations ?? {}))

    effect(() => {
      element.attrs ??= {}
      element.events ??= {}
      element.children ??= []
      const attrs = toProps(element.attrs, getActiveContext())
      const fakeContext: PrefabGeneratorContext = {
        mount: () => { }
      }
      const newNode = generator({ ...defaults, ...attrs }, () => children, fakeContext)
      delegate(newNode, element.events)
      delegate(newNode, resolveAnimations(element.animations ?? {}))
      patch(node, newNode)
      return newNode
    })

    return node
  }

  const renderElement = (element: BaseChalkElement<string>): Node | Node[] | null => {
    const pfbs = getRootSpace()
    console.log(pfbs)
    const pfb = pfbs.get(element.name)
    if (!pfb) {
      return renderComponent(element)
    }

    element.attrs ??= {}

    const props = toProps(element.attrs, getActiveContext())
    setValue(Attributes, props)
    setValue(Origin, element)

    
    const maybePromise = pfb(getActiveContext(), errors.addError)
    if (maybePromise instanceof Promise) {
      const fragment = document.createElement('div')
      onMount(() => {
        maybePromise.then((definition) => {
          const parent = fragment.parentElement
          const nodes = toArray(renderPrefab(element, props, definition))
          console.log(parent, nodes)
          for (const node of nodes) {
            if (!node || !parent) continue
            parent.insertBefore(node, parent.firstChild)
          }
        })
      })
      return fragment
    }
    return renderPrefab(element, props, maybePromise)
    
  }
  
  const renderValue = (source: string) => {
    const [, _] = source.split('{{')
    const [key] = _.split('}}')
    return _renderValue(key)
  }

  const _renderValue = (source: string) => {
    const adhoc = createAdhoc(getActiveContext())
    console.log(source, adhoc(source))
    return adhoc(source)
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

  const mount = () => {
    for (const callback of mountQueue) {
      callback()
    }
    mountQueue.length = 0
  }

  const render = (rootName: string, element: HTMLElement) => {
    (Array.from(element.children ?? [])).forEach(child => child.remove())
    const root = renderRoot(rootName)
    if (!root) return
    element.append(...toArray(root))
    mount()
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
    onMount,
    mount,
  }
}