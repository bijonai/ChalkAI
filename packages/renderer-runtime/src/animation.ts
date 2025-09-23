import { Context, createAdhoc, AnimationItem, AnimationPreset, getAnimationPreset, toProps, Animation, AnimationPresetContext } from "@chalk-dsl/renderer-core";

export interface AnimateParams {
  node?: Node
  prefab?: string
}

export function createAnimate(context: Context, { node, prefab }: AnimateParams) {
  const adhoc = createAdhoc(context)

  const animateVariable = (item: Animation) => {
    return new Promise((resolve) => {
      // resolve()
    })
  }

  const animatePreset = (item: Animation, presets: AnimationPreset[]) => {
    const ctx: AnimationPresetContext = {
      node: node ?? null,
      prefab,
      delay: item.delay ?? 0,
      duration: item.duration,
      easing: item.easing ?? 'linear',
      context,
    }
    if (presets.length === 0) return animateVariable(item)
    return new Promise((resolve) => {
      for (const preset of presets) {
        const callback = preset(
          toProps(item.params, context),
          ctx,
        )
        if (typeof callback === 'boolean' && !callback) continue
        if (typeof callback === 'function') {
          let start = performance.now()
          const loop = (id: number) => {
            const now = performance.now()
            const elapsed = now - start
            const progress = elapsed / ctx.duration
            callback(progress)
            if (progress < 1) requestAnimationFrame(loop)
            else {
              cancelAnimationFrame(id)
              resolve(void 0)
            }
          }
          requestAnimationFrame(loop)
        }
        else resolve(void 0)
      }
    })
  }

  const animateParallel = (items: AnimationItem[]) => {
    return Promise.all(items.map(animateItem))
  }

  const animateItem = (item: AnimationItem): Promise<unknown> => {
    if (!Array.isArray(item)) {
      const presets = getAnimationPreset(item.preset)
      return animatePreset(item, presets)
    }
    else return animateParallel(item)
  }
  
  return async (animations: AnimationItem[]) => {
    for (const task of animations.map(animateItem)) {
      await task
    }
  }
}
