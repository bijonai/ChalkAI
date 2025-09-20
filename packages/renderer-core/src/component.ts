import { BaseChalkElement } from "./element"

export type Component<T extends string> = {
  name: T
  props: string[]
  refs?: Record<string, string>
  root?: BaseChalkElement<string>
}