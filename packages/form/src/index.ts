export type Model<T extends readonly string[] = []> = string | ({
  [K in T[number]]: string
} & {
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
