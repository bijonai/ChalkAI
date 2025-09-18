import { signal } from "alien-signals"
import type { Signal } from "./reactivity"

export type RawContext = Record<string | symbol, unknown>
export type Context = Record<string | symbol, Signal<unknown>>
export type ToContext<T extends RawContext> = Record<string | symbol, Signal<T[keyof T]>>

export const toContext = <T extends RawContext>(context: T): ToContext<T> => {
  return Object.fromEntries(Object.entries(context).map(([key, value]) => [key, signal(value as T[keyof T])]))
}
export const rawContext = <T extends RawContext>(context: ToContext<T>): T => {
  return Object.fromEntries(Object.entries(context).map(([key, value]) => [key, value()])) as T
}
export const mergeContext = (target: Context, source: Context) => {
  return { ...target, ...source }
}

let activeContext: Context = {}
export const getActiveContext = () => activeContext
export const setActiveContext = (context: Context) => {
  activeContext = context
}
export const clearActiveContext = () => {
  activeContext = {}
}
export const rawActiveContext = () => rawContext(activeContext)
export const withContext = <T>(context: Context, fn: () => T) => {
  const previousContext = activeContext
  setActiveContext(context)
  const result = fn()
  setActiveContext(previousContext)
  return result
}