import type { RawContext } from "@chalk-dsl/renderer-core";

export type PrefabKnowledgeProp = {
  name: string
  description: string
  type: string
  required: boolean
  default?: string
}

export type PrefabKnowledge = {
  name: string
  description: string
  tags: string[]
  props: PrefabKnowledgeProp[]
  examples: string[]
  rules: string[]
}

const createPrefabKnowledgeUtils = <T extends RawContext>() => {
  const props: PrefabKnowledgeProp[] = []
  let _name = ''
  let _description = ''
  const tags: string[] = []
  const examples: string[] = []
  const rules: string[] = []

  const example = (example: string) => {
    examples.push(example)
    return utils
  }
  const rule = (rule: string) => {
    rules.push(rule)
    return utils
  }
  const prop = <K extends keyof T>(key: K) => {
    const result: PrefabKnowledgeProp = { name: key.toString(), description: '', type: '', required: true }
    const describe = (description: string) => {
      result.description = description
      return utils
    }
    const type = (type: string) => {
      result.type = type
      return utils
    }
    const optional = (defaultValue?: string) => {
      result.required = false
      result.default = defaultValue
      return utils
    }
    props.push(result)
    const utils = { describe, type, optional }
    return utils
  }

  const name = (name: string) => {
    _name = name
    return utils
  }
  const description = (description: string) => {
    _description = description
    return utils
  }
  const tag = (tag: string) => {
    tags.push(tag)
    return utils
  }

  const extend = (knowledge: PrefabKnowledge) => {
    const propSet = new Set([...props, ...knowledge.props])
    props.length = 0
    props.push(...propSet)
    const tagSet = new Set([...tags, ...knowledge.tags])
    tags.length = 0
    tags.push(...tagSet)
    return utils
  }

  const toKnowledge = (): PrefabKnowledge => ({
    name: _name,
    description: _description,
    tags,
    props,
    examples,
    rules,
  })

  const utils = {
    example,
    rule,
    prop,
    name,
    description,
    tag,
    extend,
    toKnowledge,
  }

  return utils
}

export const definePrefabKnowledge = <Props extends RawContext>(
  callback: (utils: ReturnType<typeof createPrefabKnowledgeUtils<Props>>) => void
) => {
  const utils = createPrefabKnowledgeUtils<Props>()
  callback(utils)
  return utils.toKnowledge()
}
