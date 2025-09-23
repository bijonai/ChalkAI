import type { RawContext } from "./context"

export type PrefabNamespace = Map<string, Prefab<string, RawContext, RawContext, any>>
export type PrefabChildrenGetter = () => Node[]
export type PrefabValidator = () => boolean
export type PrefabGenerator<Props extends RawContext> = (props: Props, children: PrefabChildrenGetter) => Node

type MergeWithDefaults<
  Props extends RawContext,
  Defaults extends Partial<Props>
> = Props & Required<Defaults>

type ResolvedProps<
  Props extends RawContext,
  Defaults extends Partial<Props> | undefined
> = Defaults extends Partial<Props>
  ? MergeWithDefaults<Props, Defaults>
  : Props

export type Prefab<
  Name extends string,
  Props extends RawContext = RawContext,
  Ctx extends RawContext = RawContext,
  Defaults extends Partial<Props> | undefined = undefined
  > = (context: Ctx) => {
    name: Name
    validator?: PrefabValidator
    generator: PrefabGenerator<ResolvedProps<Props, Defaults>>
    provides?: Record<string | symbol, unknown>
    defaults?: Defaults
    space?: PrefabNamespace
}
export const definePrefab = <
  Name extends string,
  Props extends RawContext = RawContext,
  Ctx extends RawContext = RawContext,
  Defaults extends Partial<Props> | undefined = undefined
>(prefab: Prefab<Name, Props, Ctx, Defaults>) => prefab

const rootSpace: PrefabNamespace = new Map()
export const registerPrefab = <T extends RawContext>(name: string, prefab: Prefab<string, T, T>) => {
  rootSpace.set(name, prefab as Prefab<string, RawContext, RawContext>)
}
export const getRootSpace = () => rootSpace
