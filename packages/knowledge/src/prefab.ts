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
  props: PrefabKnowledgeProp[]
}

const createPrefabKnowledgeUtils = <T extends RawContext>() => {
  const props: PrefabKnowledgeProp[] = []
  let name = ''
  let description = ''

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

  const toKnowledge = (): PrefabKnowledge => ({
    name,
    description,
    props,
  })

  return {
    prop,
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
