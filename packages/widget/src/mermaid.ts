import { definePrefab } from "@chalk-dsl/renderer-core"
import { definePrefabKnowledge } from "@chalk-dsl/knowledge"
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default"
import { registerPrefab } from "@chalk-dsl/renderer-runtime"
import mmd from 'mermaid'
import { toText } from "./code"

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface MermaidAttributes {
  
}

const mermaid = definePrefab<'mermaid', MermaidAttributes>(() => {
  mmd.initialize({
    theme: 'base'
  })
  return {
    name: 'mermaid',
    generator: (attrs, children) => {
      const container = document.createElement('div')
      container.style.width = '100%'
      container.style.justifyContent = 'center'
      container.style.alignItems = 'center'

      const code = toText(children())
      mmd.render('mermaid', code).then((result) => {
        container.innerHTML = result.svg
      })
      return container
    }
  }
})

export default mermaid
registerPrefab('mermaid', mermaid)

// ------------

export const knowledge = definePrefabKnowledge<MermaidAttributes>((utils) => {
  utils.name('mermaid')
  utils.description('A mermaid diagram')
  utils.rule('The mermaid code should be children nodes as text nodes')
})
addPrefabKnowledge(knowledge)