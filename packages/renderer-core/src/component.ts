import { BaseChalkElement } from "./element"

type MaybeArray<T> = T | T[]
export type Component<T extends string> = {
  name: T
  props: string[]
  refs?: Record<string, string>
  root?: MaybeArray<BaseChalkElement<string> | string>
}