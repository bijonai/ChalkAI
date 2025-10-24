import { BaseChalkElement, Component } from "@chalk-dsl/renderer-core";
import { AttributeNode, BaseNode, ElementNode, NodeType, parse, ParseOptions, TextNode, ValueNode } from "@chalk-dsl/x-parser";
import { parse as parseYaml } from 'yaml'

export function parseXAttribute(attribute: AttributeNode) {
  const type =
    attribute.name.startsWith(':') ? 'expression'
      // : attribute.name.startsWith('&') ? 'animation'
        : attribute.name.startsWith('@') ? 'event'
          : attribute.name.startsWith('#') ? 'statement'
            : 'string'
  switch (type) {
    case 'expression': {
      return {
        type,
        value: attribute.value,
        key: attribute.name,
      }
    }
    // case 'animation': {
    //   return {
    //     type,
    //     value: attribute.value,
    //     key: attribute.name,
    //   }
    // }
    case 'event': {
      return {
        type,
        value: attribute.value,
        key: attribute.name,
      }
    }
    case 'statement': {
      return {
        type,
        value: attribute.value,
        key: attribute.name,
      }
    }
    case 'string': {
      return {
        type,
        value: attribute.value,
        key: attribute.name,
      }
    }
  }
}

export function parseXNode(node: BaseNode, parent: BaseChalkElement<string> | null = null): BaseChalkElement<string> | string {
  if (node.type === NodeType.ELEMENT) {
    const element: BaseChalkElement<string> = {
      name: (<ElementNode>node).tag,
      id: `${(<ElementNode>node).tag}-${crypto.randomUUID()}`,
    }
    element.attrs ??= {}
    element.events ??= {}
    element.statements ??= {}
    element.children ??= []
    element.parent = parent ?? undefined
    for (const attribute of (<ElementNode>node).attributes) {
      const attr = parseXAttribute(attribute)
      if (attr.type === 'expression' || attr.type === 'string') {
        element.attrs[attr.key] = attr.value
      }
      else if (attr.type === 'event') {
        element.events[attr.key.slice(1)] = attr.value
      }
      else if (attr.type === 'statement') {
        element.statements[attr.key.slice(1)] = attr.value
      }
    }
    for (const child of (<ElementNode>node).children) {
      element.children.push(parseXNode(child, element))
    }
    return element
  }
  else if (node.type === NodeType.TEXT) {
    return (node as TextNode).content.trim()
  }
  else if (node.type === NodeType.VALUE) {
    return `{{ ${(node as ValueNode).value} }}`
  }
  return ''
}

export function parseX(content: string, options: ParseOptions): (BaseChalkElement<string> | string)[] {
  const { children } = parse(content, options)
  return children.map((child) => parseXNode(child, null))
}

export function parseComponent(content: string, options: ParseOptions): Component<string> {
  const component: Component<string> = {
    name: '',
    props: [],
    refs: {},
  }
  const REG = /---.*?---/gms
  const match = content.match(REG)
  if (match) {
    const yamlContent = match[0].trim().slice(3, -3)
    const yaml = parseYaml(yamlContent)
    component.name = yaml.name
    component.props = yaml.props
    component.root = yaml.root
    component.refs = yaml.refs
  }
  const template = content.replace(REG, '').trim()
  component.root = parseX(template, options)
  return component
}

export * from '@chalk-dsl/x-parser'
