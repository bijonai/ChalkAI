// import { signal } from "alien-signals"
import { Reactive, reactive } from "@vue/reactivity"

export type RawContext = Record<string | symbol, unknown>
export type Context = Reactive<RawContext>
export const mergeContext = (target: Context, source: Context) => {
  return reactive({ ...target, ...source })
}

export const createContext = (context: Context) => {
  const getActiveContext = () => reactive(context) as Context
  const setActiveContext = (_context: Context) => {
    context = reactive(_context) as Context
  }
  const clearActiveContext = () => {
    context = reactive({}) as Context
  }
  const withContext = <T>(_context: Context, fn: () => T) => {
    const previousContext = _context
    setActiveContext(_context)
    const result = fn()
    setActiveContext(previousContext)
    return result
  }
  const setValue = (key: string, value: unknown) => {
    context[key] = value
  }
  const getValue = (key: string) => {
    return context[key]
  }

  return {
    getActiveContext,
    setActiveContext,
    clearActiveContext,
    withContext,
    setValue,
    getValue,
  }
}