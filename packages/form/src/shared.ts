import { definePrefabKnowledge } from "@chalk-dsl/knowledge"

export type Model<T extends readonly string[] = []> = string | ({
  [K in T[number]]: string
} & {
  model: string
  default: string
})
export interface FormModelAttributes<T extends readonly string[] = []> {
  model: Model<T>
}

export const parseModel = <T extends readonly string[] = []>(model: Model<T>) => {
  if (typeof model === 'string') {
    return {
      model,
      default: model
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