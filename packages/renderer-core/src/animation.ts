import { RawContext } from "./context";
import { AttributeValue } from "./element";

export type Animation = {
  preset: string
  params: Record<string, AttributeValue>
  duration: number
  easing?: string
  delay?: number
}

export type ParallelAnimation = Animation[]
export type AnimationItem = Animation | ParallelAnimation

export type AnimationPresetContext<Ctx extends RawContext = RawContext> = {
  node: Node | null
  context: Ctx
  duration: number
  delay: number
  easing: string
  prefab?: string
}
export type AnimationPresetGenerator = 
  (progress: number) => boolean | void
/**
 * IF return AnimationPresetGenerator, it will be called in the RAF.
 * IF return (void | true), it will be called, but will not launch RAF. (usually for CSS transition)
 * IF return false, it will be ignored.
 */
export type AnimationPreset<
  Params extends RawContext = RawContext,
  Ctx extends RawContext = RawContext,
> = (params: Params, context: AnimationPresetContext<Ctx>)
  => AnimationPresetGenerator | void | boolean
  
export type AnimationPresetSpace = Map<string, AnimationPreset[]>
const animationPresets: AnimationPresetSpace = new Map()
export const registerAnimationPreset = <T extends RawContext>(name: string, preset: AnimationPreset<T, T>) => {
  const presets = animationPresets.get(name) || []
  presets.push(preset as AnimationPreset<RawContext, RawContext>)
  animationPresets.set(name, presets)
}
export const getAnimationPreset = (name: string) => {
  return animationPresets.get(name) || []
}