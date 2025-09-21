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
}

const createPrefabKnowledgeUtils = <T extends RawContext>() => {
  const props: PrefabKnowledgeProp[] = []
  let _name = ''
  let _description = ''
  const tags: string[] = []

  const prop = <K extends keyof T>(name: K) => {
    const result: PrefabKnowledgeProp = { name: name.toString(), description: '', type: '', required: true }
    const describe = (description: string) => result.description = description
    const type = (type: string) => result.type = type
    const optional = (defaultValue?: string) => {
      result.required = false
      result.default = defaultValue
    }
    props.push(result)
    return { describe, type, optional }
  }

  const name = (name: string) => _name = name
  const description = (description: string) => _description = description
  const tag = (tag: string) => tags.push(tag)

  const toKnowledge = (): PrefabKnowledge => ({
    name: _name,
    description: _description,
    tags,
    props,
  })

  return {
    prop,
    tag,
    name,
    description,
    toKnowledge,
  }
}

export const definePrefabKnowledge = <Props extends RawContext>(
  callback: (utils: ReturnType<typeof createPrefabKnowledgeUtils<Props>>) => void
) => {
  const utils = createPrefabKnowledgeUtils<Props>()
  callback(utils)
  return utils.toKnowledge()
}
