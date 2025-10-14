import { definePrefabKnowledge } from "@chalk-dsl/knowledge"

export type Model<T extends readonly string[] = []> = ({
  [K in T[number]]: string
} & {
  model: string
  default: string
})
export interface FormModelAttributes<T extends readonly string[] = []> {
  model?: Model<T>
}

export const parseModel = <T extends readonly string[] = []>(model: Model<T> | string) => {
  if (!model) return { model: null, default: null }
  if (typeof model === 'string') {
    return {
      model,
      default: model
    }
  } else if (typeof model === 'object') {
    return {
      ...model
    }
  }
  return model
}

export const modelKnowledge = definePrefabKnowledge<FormModelAttributes>((utils) => {
  utils.prop('model')
    .describe('reactive variable name to bind, value will be used as the value of the input')
    .type('string | { [key: string]: string }').optional()
  utils.rule('The variable need to defined previously.')
})