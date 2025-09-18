import type { RawContext } from "./context"

export type PrefabNamespace = Map<string, Prefab<string>>
export type PrefabChildrenGetter = () => Node[]
export type PrefabValidator = () => boolean
export type PrefabGenerator<Props extends RawContext> = (props: Props, children: PrefabChildrenGetter) => Node
export type Prefab<
  Name extends string,
  Props extends RawContext = RawContext,
  Ctx extends RawContext = RawContext,
  > = (context: Ctx) => {
    name: Name
    validator?: PrefabValidator
    generator: PrefabGenerator<Props>
    provides?: Record<string | symbol, unknown>
    space?: PrefabNamespace
}
export const definePrefab = <
  Name extends string,
  Props extends RawContext = RawContext,
  Ctx extends RawContext = RawContext,
>(prefab: Prefab<Name, Props, Ctx>) => prefab

const rootSpace: PrefabNamespace = new Map()
export const registerPrefab = <T extends RawContext>(name: string, prefab: Prefab<string, T, T>) => {
  rootSpace.set(name, prefab as Prefab<string, RawContext, RawContext>)
}
export const getRootSpace = () => rootSpace
