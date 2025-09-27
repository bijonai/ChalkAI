import { Context, AnimationItem, AnimationPreset, getAnimationPreset, toProps, Animation, AnimationPresetContext, defineAnimationPreset, RawContext } from "@chalk-dsl/renderer-core";

export interface AnimateParams {
  node?: Node
  prefab?: string
}

export function createAnimate(context: Context, { node, prefab }: AnimateParams) {

  const runRaf = (callback: (progress: number) => void, duration: number, resolve: (value: unknown) => void) => {
    const start = performance.now()
    const loop = (id: number) => {
      const now = performance.now()
      const elapsed = now - start
      const progress = elapsed / duration
      callback(progress)
      if (progress < 1) requestAnimationFrame(loop)
      else {
        cancelAnimationFrame(id)
        resolve(void 0)
      }
    }
    requestAnimationFrame(loop)
  }

  const variableAnimation = defineAnimationPreset<{
    from?: number
    to: number
  }, object>((params, { preset }) => {
    const from = params.from ?? context[preset] as number
    return (progress: number) => {
      const value = from + (params.to - from) * progress
      context[preset] = value > params.to ? params.to : value
    }
  })

  const animatePreset = (item: Animation, presets: AnimationPreset[]) => {
    const ctx: AnimationPresetContext = {
      node: node ?? null,
      prefab,
      delay: item.delay ?? 0,
      duration: item.duration,
      easing: item.easing ?? 'linear',
      context,
      preset: item.preset,
    }
    if (presets.length === 0) {
      presets.push(<AnimationPreset<RawContext, RawContext>>variableAnimation)
    }
    return new Promise((resolve) => {
      for (const preset of presets) {
        const callback = preset(
          toProps(item.params, context),
          ctx,
        )
        if (typeof callback === 'boolean' && !callback) continue
        if (typeof callback === 'function') {
          runRaf(callback, ctx.duration, resolve)
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
    for await (const task of animations) {
      await animateItem(task)
    }
  }
}
