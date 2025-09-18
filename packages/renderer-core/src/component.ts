import type { RawContext } from "./context"

export type ComponentNamespace = Map<string, Component<string>>
export type ComponentChildrenGetter = () => Node[]
export type ComponentValidator = () => boolean
export type ComponentGenerator<Props extends RawContext> = (props: Props, children: ComponentChildrenGetter) => Node
export type Component<
  Name extends string,
  Props extends RawContext = RawContext,
  Ctx extends RawContext = RawContext,
  > = (context: Ctx) => {
    name: Name
    validator?: ComponentValidator
    generator?: ComponentGenerator<Props>
    provides?: Record<string | symbol, unknown>
    space?: ComponentNamespace
}

const rootSpace: ComponentNamespace = new Map()
export const registerComponent = <T extends RawContext>(component: Component<string, T, T>) => {
  rootSpace.set(component.name, component as Component<string, RawContext, RawContext>)
}
export const getRootSpace = () => rootSpace
