import { createAdhoc, defineStatement, registerStatement } from "@chalk-dsl/renderer-core"

export const ifStatement = defineStatement((source) => {
  return {
    pre(context, element) {
      const adhoc = createAdhoc(context)
      const condition = adhoc(source)
      if (condition) {
        if (element.statements) element.statements['#validated'] = 'passed'
        return element
      }
      if (element.statements) element.statements['#validated'] = 'failed'
      return null
    }
  }
})

export const elseStatement = defineStatement(() => {
  return {
    pre(context, element) {
      if (!element.parent) return null
      const elements = element.parent.children
      if (!elements) return null
      const index = elements.indexOf(element)
      const validated = elements.slice(0, index).filter(element => typeof element === 'object' && element.statements && element.statements['#validated'] === 'failed')
      if (validated.length === 0) return null
      if (element.statements) element.statements['#validated'] = 'passed'
      return element
    }
  }
})

export const elifStatement = defineStatement((source) => {
  return {
    pre(context, element) {
      if (!element.parent) return null
      const elements = element.parent.children
      if (!elements) return null
      const index = elements.indexOf(element)
      const adhoc = createAdhoc(context)
      const validated = elements.slice(0, index).filter(element => typeof element === 'object' && element.statements && element.statements['#validated'] === 'failed')
      if (validated.length === 0) return null
      const condition = adhoc(source)
      if (condition) {
        if (element.statements) element.statements['#validated'] = 'passed'
        return element
      }
      if (element.statements) {
        element.statements['#validated'] = 'failed'
        return null
      }
      return null
    }
  }
})

registerStatement('if', ifStatement)
registerStatement('else', elseStatement)
registerStatement('elif', elifStatement)
