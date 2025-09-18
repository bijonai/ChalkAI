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
    generator?: PrefabGenerator<Props>
    provides?: Record<string | symbol, unknown>
    space?: PrefabNamespace
}

const rootSpace: PrefabNamespace = new Map()
export const registerPrefab = <T extends RawContext>(prefab: Prefab<string, T, T>) => {
  rootSpace.set(prefab.name, prefab as Prefab<string, RawContext, RawContext>)
}
export const getRootSpace = () => rootSpace
