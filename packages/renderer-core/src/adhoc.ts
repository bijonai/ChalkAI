import { Context } from "./context"
import { AttributeValue, ComputedAttributeValue } from "./element"

export function createAdhoc(context: Context) {
  return (src: string, o?: Context) => {
    return new Function(`return (function($__ctx){with($__ctx){return (${src});}});`)()({
      ...(o ?? context),
    })
  }
}

export function toProp(source: AttributeValue, context: Context) {
  const _computed = (source: ComputedAttributeValue) => {
    const [, _] = source.split('{{')
    const [key, ..._rest] = _.split('}}')
    return createAdhoc(context)(key)
  }
  const _string = (source: string) => {
    return /{{.+}}/.test(source) ? _computed(source as ComputedAttributeValue) : source
  }
  const _common = (source: number | boolean | null | undefined) => source
  const _array = (sources: AttributeValue[]) => sources.map((source) => toProp(source, context))
  const _object = (source: Record<string, AttributeValue>) => Object.fromEntries(Object.entries(source).map(([key, value]) => [key, toProp(value, context)]))
  const typeMap = new Map<string, (source: any) => unknown>()
  typeMap.set('string', _string)
  typeMap.set('number', _common)
  typeMap.set('boolean', _common)
  typeMap.set('null', _common)
  typeMap.set('undefined', _common)
  typeMap.set('array', _array)
  typeMap.set('object', _object)
  return typeMap.get(typeof source)?.(source)
}

export function toProps(attrs: Record<string, AttributeValue>, context: Context) {
  return Object.fromEntries(Object.entries(attrs).map(([key, value]) => [key, toProp(value, context)]))
}
