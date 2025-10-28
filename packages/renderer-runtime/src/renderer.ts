import { Component, createContext, BaseChalkElement, createAdhoc, effect, mergeContext, toProps, reactive, getRootSpace, ref, AnimationItem, createErrorContainer, getStatement, StatementPreGenerator, StatementPostGenerator, Attributes, Origin, PrefabGeneratorContext, PrefabDefinition, RawContext, PrefabParseType } from "@chalk-dsl/renderer-core"
import { ElementNotFoundError } from "./error"
import { createDelegate } from "./delegate"
import { createAnimate } from "./animation"
import { createMarkdown } from "./builtins/markdown"
import patch from 'morphdom'
import { createParser } from "./parser"

export const toArray = <T>(value: T | T[]): T[] => Array.isArray(value) ? value : [value]

export function createRenderer() {
  const { getActiveContext, setActiveContext, clearActiveContext, withContext, setValue, getValue } = createContext(reactive({}))
  const errors = createErrorContainer()
  const beginAnimations: (() => void)[] = []
  const { parse } = createParser({ space: getRootSpace() })
  const markdown = createMarkdown()

  const mountQueue: (() => void)[] = []
  const onMount = (callback: () => void) => {
    mountQueue.push(callback)
  }
  const components: Component<string>[] = []

  const addComponents = (...newComponents: (Component<string> | string)[]) => {
    const names: string[] = []
    for (const component of newComponents) {
      if (typeof component === 'string') {
        const parsed = parse(component)
        components.push(parsed)
        names.push(parsed.name)
      } else {
        components.push(component)
        names.push(component.name)
      }
    }
    return names as [string, ...string[]]
  }

  const preprocessElement = (elements: (BaseChalkElement<string> | string)[], parent?: BaseChalkElement<string>) => {
    // Merge consecutive string children with newline separators
    const mergedChildren: (BaseChalkElement<string> | string)[] = []
    let currentStringGroup: string[] = []

    for (const child of elements) {
      if (typeof child === 'string') {
        currentStringGroup.push(child)
      } else {
        // If we have accumulated string children, merge them
        if (currentStringGroup.length > 0) {
          mergedChildren.push(currentStringGroup.join(''))
          currentStringGroup = []
        }
        // Process non-string child recursively
        if (typeof child === 'object' && child !== null && 'children' in child) {
          child.children = preprocessElement(child.children ?? [], child)
        }
        mergedChildren.push(child)
      }
    }

    // Handle any remaining string children at the end
    if (currentStringGroup.length > 0) {
      mergedChildren.push(currentStringGroup.join(''))
    }

    return mergedChildren
  }


  const renderComponent = (element: BaseChalkElement<string>, parsetype: PrefabParseType = 'node'): Node | Node[] | null => {
    const component = components.find((component) => component.name === element.name)
    if (!component) {
      errors.addError({ name: "Element Not Found", message: `Element ${element.name} not found`, element } satisfies ElementNotFoundError)
      return null
    }
    if (!component.root) {
      return document.createTextNode('')
    }
    const roots = preprocessElement(toArray(component.root))
    const refs = Object.entries(component.refs ?? {})
    const retryWaitlist: string[] = []
    const resolve = (key: string, value: string, retrying: boolean = false) => {
      const _ref = ref()
      setValue(key, _ref)
      const update = () => {
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
      }
      update()
      effect(update)
    }
    for (const reflection of refs) {
      const [key, value] = reflection
      resolve(key, value)
    }

    // Set up default values to prevent undefined access
    return roots.flatMap(root => {
      if (typeof root === 'string') {
        return renderText(root, parsetype)
      }
      root.attrs ??= {}
      root.events ??= {}
      root.statements ??= {}
      root.children ??= []

      const attrs = toProps(root.attrs, getActiveContext())
      return withContext(
        mergeContext(getActiveContext(), attrs),
        (): Node | Node[] | null => renderElement(root!, parsetype)
      )
    }) as Node[]
  }

  const renderPrefab = (
    element: BaseChalkElement<string>,
    props: RawContext,
    { name, validator, generator, provides, defaults }: PrefabDefinition<string>,
    parsetype: PrefabParseType = 'node'
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
          return withContext(contextOverride, () => renderNode(element, parsetype))
        }
        return renderNode(element, parsetype)
      })
    }

    const children = withContext(
      mergeContext(getActiveContext(), provides ?? {}),
      () => (element.children ?? []).flatMap(child => renderNode(child, parsetype)).filter(child => child !== null && child !== undefined)
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

  const renderElement = (element: BaseChalkElement<string>, parsetype: PrefabParseType = 'node'): Node | Node[] | null => {
    const pfbs = getRootSpace()
    const pfb = pfbs.get(element.name)
    if (!pfb) {
      return renderComponent(element, parsetype)
    }

    element.attrs ??= {}

    const props = toProps(element.attrs, getActiveContext())
    setValue(Attributes, props)
    setValue(Origin, element)


    const maybePromise = pfb.prefab(getActiveContext(), errors.addError)
    if (maybePromise instanceof Promise) {
      const fragment = document.createElement('div')
      onMount(() => {
        maybePromise.then((definition) => {
          const parent = fragment.parentElement
          const nodes = toArray(renderPrefab(element, props, definition))
          for (const node of nodes) {
            if (!node || !parent) continue
            parent.insertBefore(node, parent.firstChild)
          }
        })
      })
      return fragment
    }
    return renderPrefab(element, props, maybePromise, pfb.type)

  }

  const renderValue = (source: string) => {
    const [, _] = source.split('{{')
    const [key] = _.split('}}')
    return _renderValue(key)
  }

  const _renderValue = (source: string) => {
    const adhoc = createAdhoc(getActiveContext())
    return adhoc(source)
  }

  const renderText = (source: string, parsetype: PrefabParseType = 'node') => {
    const text = document.createElement('span')
    effect(() => {
      const value = source.replace(/\n*{{(.*?)}}\n*/g, (match, key) => {
        return String(_renderValue(key)).trim()
      })
      if (parsetype === 'node') {
        markdown(value).then(result => {
          text.innerHTML = result.toString()
        })
      } else {
        text.innerHTML = value
      }
    })
    return text
  }

  const renderNode = (element: BaseChalkElement<string> | string, parsetype: PrefabParseType = 'node') => {
    if (typeof element === 'string') {
      return renderText(element, parsetype)
    }
    return renderElement(element, parsetype)
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
    addComponents,
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