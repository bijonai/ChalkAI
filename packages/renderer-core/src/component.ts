import { BaseChalkElement } from "./element"

export type Component<T extends string> = {
  name: T
  props: string[]
  root: BaseChalkElement<string>
}