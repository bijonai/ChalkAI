import { defineAsyncPrefab, registerPrefab } from "@chalk-dsl/renderer-core"
import { createHighlighter } from "shiki"
import { definePrefabKnowledge } from "@chalk-dsl/knowledge"
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default"

export interface CodeAttributes {
  lang: string
}

export const toText = (nodes: Node[]) => {
  let result = ''
  for (const node of nodes) {
    result += node.textContent
  }
  return result
}

const code = defineAsyncPrefab<'code', CodeAttributes>(async () => {
  const highlighter = await createHighlighter({
    themes: ['github-dark'],
    langs: [
      'javascript', 'jsx', 'tsx', 'typescript', 'python', 'java', 'cpp', 'c', 'rust', 'go', 'php', 'ruby', 'swift', 'kotlin', 'scala', 'haskell', 'ocaml', 'erlang', 'elixir', 'rust', 'go', 'php', 'ruby', 'swift', 'kotlin', 'scala', 'haskell', 'ocaml', 'erlang', 'elixir'
    ],
  })
  return {
    name: 'code',
    generator: (attrs, children) => {
      const code = document.createElement('div')
      const content = toText(children())
      console.log(content, children())
      const html = highlighter.codeToHtml(content, {
        lang: attrs.lang,
        theme: 'github-dark',
      })
      code.innerHTML = html
      return code
    },
  }
})

export default code

registerPrefab('code', code)

// ------

export const knowledge = definePrefabKnowledge<CodeAttributes>((utils) => {
  utils.name('code')
  utils.description('A code block')
  utils.prop('lang')
    .describe('the language of the code')
    .type('string')
  utils.rule('The code should be children nodes as text nodes')
})

addPrefabKnowledge(knowledge)
