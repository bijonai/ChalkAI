import { defineAnimationPreset } from "@chalk-dsl/renderer-core"

export const variableAnimation = defineAnimationPreset<[number, number?], object>((params, { preset, context }) => {
  const from = params.length === 2 ? params[0] : (<Record<string, number>>context)[preset]
  const to = params.length === 2 ? params[1]! : params[0]!
  return (progress: number) => {
    const value = from + (to - from) * progress
    ;(<Record<string, number>>context)[preset] = value > to ? to : value
  }
})
