import { Animation, AnimationPreset, AnimationPresetContext, AnimationPresetGenerator, getAnimationPreset, RawContext, toProp } from "@chalk-dsl/renderer-core"
import { variableAnimation } from "./variable"
import { runRaf } from "./raf"

export interface AnimateOptions {
  node?: Node
  prefab?: string
  context: RawContext
  animations: Record<string, Animation[] | Animation>
}

export function createAnimate({ node, prefab, context, animations }: AnimateOptions) {
  const toArray = <T>(value: T | T[]): T[] => {
    return Array.isArray(value) ? value : [value]
  }
  
  const animate = (animation: Animation) => {
    const presets = getAnimationPreset(animation.preset)
    const params = animation.params.map((param, index) => toProp(`:p${index}`, param, context))
    const ctx: AnimationPresetContext = {
      node: node ?? null,
      prefab,
      delay: animation.delay ?? 0,
      duration: animation.duration,
      easing: animation.easing ?? 'linear',
      context,
      preset: animation.preset,
    }
    const preset = presets.find(preset => preset(params, ctx)) ?? (variableAnimation as AnimationPreset)
    const callback = preset(params, ctx)
    return new Promise((resolve) => {
      if (typeof callback !== 'function') resolve(void 0)
      runRaf(<AnimationPresetGenerator>callback, animation.duration, resolve)
    })
  }

  const animateGroup = async (animations: Animation[]) => {
    for (const animation of animations) {
      await animate(animation)
    }
  }

  return async (...anims: (string | string[])[]) => {
    for (const anim of anims) {
      if (Array.isArray(anim)) {
        await Promise.all(anim.map((a) => animateGroup(toArray(animations[a]))))
      }
      else {
        await animateGroup(toArray(animations[anim]))
      }
    }
  }
}