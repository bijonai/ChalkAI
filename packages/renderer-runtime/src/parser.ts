import { PrefabNamespace } from "@chalk-dsl/renderer-core";
import { ModeResolver, parseComponent, TextMode } from "@chalk-dsl/x";

export interface ParserOptions {
  space: PrefabNamespace
}

export function createParser({ space }: ParserOptions) {
  const loadModeResolver: () => ModeResolver
    = () => (tag: string) => {
      const prefab = space.get(tag)
      if (!prefab) return TextMode.DATA
      return prefab.type === 'node' ? TextMode.DATA : TextMode.RAWTEXT
    }
  
  const parse = (content: string) => {
    return parseComponent(content, {
      resolver: loadModeResolver(),
    })
  }
  
  return {
    loadModeResolver,
    parse,
  }
}