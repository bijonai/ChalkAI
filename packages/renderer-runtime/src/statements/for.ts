import { BaseChalkElement, Context, createAdhoc, defineStatement, effect, mergeContext, reactive, ref, registerStatement, StatementPostGenerator } from "@chalk-dsl/renderer-core";
import { toArray } from "../renderer";
import morph from 'morphdom'

export const forStatement = defineStatement((source) => {
  const resolve = (
    iterable: Iterable<unknown>,
    v: string,
    element: BaseChalkElement<string>,
    res: (element: BaseChalkElement<string>, context: Context) => Node | Node[] | null,
    context: Context
  ) => toArray(
    Array.from(iterable).flatMap(item => {
      // Create a new context for each iteration to prevent value pollution
      const iterationContext = mergeContext(reactive({}), context)
      iterationContext[v] = ref(item)
      console.log('v', v, item)
      const result = res(element, iterationContext)
      return toArray(result).filter(child => child !== null && child !== undefined)
    })
  ).filter(child => child !== null && child !== undefined)

  return {
    pre(context, element, res) {
      const [v, iterableSource] = source.split(' in ')
      const iterable = createAdhoc(context)(iterableSource) as Iterable<unknown>

      const target: Node[] = resolve(iterable, v, element, res, context)
      effect(() => {
        const nodes = resolve(iterable, v, element, res, context)
        if (nodes.length === 0) {
          target.length = 0
          return target.push(document.createDocumentFragment())
        }
        if (target[0]!.parentElement) {
          const parent = target[0]!.parentElement
          for (const [index, node] of target.entries()) {
            if (index < target.length) {
              morph(node, nodes[index])
            } else { }
          }
          if (target.length < nodes.length) {
            nodes.slice(target.length, nodes.length).forEach(node => {
              target.push(node)
              parent.insertBefore(node, target.at(-1)!.nextSibling)
            })
          }
        }
      })
      return target
    }
  }
})

registerStatement('for', forStatement)
