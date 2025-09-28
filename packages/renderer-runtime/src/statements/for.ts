import { createAdhoc, defineStatement, mergeContext, reactive, ref, registerStatement } from "@chalk-dsl/renderer-core";
import { toArray } from "../renderer";

export const forStatement = defineStatement((source) => {
  return {
    post(context, element, resolve) {
      const [v, iterableSource] = source.split(' in ')
      const iterable = createAdhoc(context)(iterableSource) as Iterable<unknown>
      
      return toArray(
        Array.from(iterable).flatMap(item => {
          // Create a new context for each iteration to prevent value pollution
          const iterationContext = mergeContext(reactive({}), context)
          iterationContext[v] = ref(item)
          console.log('v', v, item)
          const result = resolve(element, iterationContext)
          return toArray(result).filter(child => child !== null && child !== undefined)
        })
      ).filter(child => child !== null && child !== undefined)
    }
  }
})

registerStatement('for', forStatement)
