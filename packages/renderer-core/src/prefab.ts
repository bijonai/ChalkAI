import type { RawContext } from "./context"
import { BoxError } from "./error"

export type PrefabNamespace = Map<string, Prefab<string, RawContext, RawContext>>
export type PrefabChildrenGetter = () => Node[]
export type PrefabValidator = () => boolean
export type PrefabGenerator<Props extends RawContext> = (props: Props, children: PrefabChildrenGetter) => Node

export type Prefab<
  Name extends string,
  Props extends RawContext = RawContext,
  Ctx extends RawContext = RawContext,
> = (context: Ctx, unexpected: (error: BoxError<string>) => void) => {
    name: Name
    validator?: PrefabValidator
    generator: PrefabGenerator<Props>
    provides?: Record<string | symbol, unknown>
    defaults?: Partial<Props>
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
