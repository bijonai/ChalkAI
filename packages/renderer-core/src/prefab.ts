import type { RawContext } from "./context"
import { ChalkError } from "./error"

export type PrefabNamespace = Map<string, Prefab<string, RawContext, RawContext> | AsyncPrefab<string, RawContext, RawContext>>
export type PrefabChildrenGetter = () => Node[]
export type PrefabValidator = () => boolean
export type PrefabGeneratorMount = (callback: () => void) => void
export type PrefabGeneratorContext = {
  mount: PrefabGeneratorMount
}
export type PrefabGenerator<Props extends RawContext> = (props: Props, children: PrefabChildrenGetter, context: PrefabGeneratorContext) => Node
export type PrefabDefinition<Name extends string, Props extends RawContext = RawContext> = {
  name: Name
  validator?: PrefabValidator
  generator: PrefabGenerator<Props>
  provides?: Record<string | symbol, unknown>
  defaults?: Partial<Props>
  space?: PrefabNamespace
}

export type Prefab<
  Name extends string,
  Props extends RawContext = RawContext,
  Ctx extends RawContext = RawContext,
> = (context: Ctx, unexpected: (error: ChalkError<string>) => void) => PrefabDefinition<Name, Props>
export type AsyncPrefab<
  Name extends string,
  Props extends RawContext = RawContext,
  Ctx extends RawContext = RawContext,
> = (context: Ctx, unexpected: (error: ChalkError<string>) => void) => Promise<PrefabDefinition<Name, Props>>

export const definePrefab = <
  Name extends string,
  Props extends RawContext = RawContext,
  Ctx extends RawContext = RawContext,
>(prefab: Prefab<Name, Props, Ctx>) => prefab

export const defineAsyncPrefab = <
  Name extends string,
  Props extends RawContext = RawContext,
  Ctx extends RawContext = RawContext,
>(prefab: AsyncPrefab<Name, Props, Ctx>) => prefab

const rootSpace: PrefabNamespace = new Map()
export const registerPrefab = <
  T extends RawContext,
  K extends RawContext = RawContext,
>(name: string, prefab: Prefab<string, T, K> | AsyncPrefab<string, T, K>) => {
  rootSpace.set(name, prefab as Prefab<string, RawContext, RawContext> | AsyncPrefab<string, RawContext, RawContext>)
}
export const getRootSpace = () => rootSpace
