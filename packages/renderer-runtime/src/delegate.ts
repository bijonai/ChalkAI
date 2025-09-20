import { Context, createAdhoc } from "@chalk-dsl/renderer-core";

export function createDelegate(node: Node, context: Context) {
  const adhoc = createAdhoc(context)
  const wrap = (handlerSource: string) => {
    return `(function() { ${handlerSource} })`
  }
  return (event: string, handlerSource: string) => {
    const handler = adhoc(wrap(handlerSource))
    node.addEventListener(event, handler)
  }
}