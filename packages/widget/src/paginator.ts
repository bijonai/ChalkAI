import { PrefabKnowledge, definePrefabKnowledge } from "@chalk-dsl/knowledge";
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default";
import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core";
import { useSlot } from "@chalk-dsl/renderer-runtime";
import { theme } from "@chalk-dsl/utils-theme";

export interface PaginatorAttributes {
  default: string
}

const paginator = definePrefab<'paginator', PaginatorAttributes>(() => {
  return {
    name: 'paginator',
    generator: (attrs, children) => {
      const root = document.createElement('div')
      root.style.display = 'flex'
      root.style.flexDirection = 'column'
      root.style.width = '100%'

      const tabs = document.createElement('div')
      tabs.style.display = 'flex'
      tabs.style.flexDirection = 'row'
      // tabs.style.height = '30px'
      tabs.style.width = '100%'
      tabs.style.gap = '5px'
      root.appendChild(tabs)

      const content = document.createElement('div')
      content.style.display = 'flex'
      content.style.flexDirection = 'column'
      content.style.margin = '10px'
      content.style.padding = '10px'
      content.style.borderRadius = '5px'
      content.style.border = `1px solid ${theme.pallete('primary')}`
      root.appendChild(content)

      const [slots] = useSlot<[`tab:${string}`]>(children)
      for (const slot of Object.entries(slots)) {
        const [type, node] = slot
        if (type.startsWith('tab:')) {
          const name = type.replace('tab:', '')
          const tab = document.createElement('button')
          tab.textContent = name
          const tabContent = document.createElement('div')
          if (attrs.default !== name) tabContent.style.display = 'none'
          tabContent.append(...(node ?? []))
          content.appendChild(tabContent)
          tabs.appendChild(tab)
          tab.addEventListener('click', () => {
            Array.from(content.children).forEach(child => {
              (child as HTMLElement).style.display = 'none'
            })
            ;(tabContent as HTMLElement).style.display = 'block'
          })
        }
      }

      return root
    }
  }
})

export default paginator

registerPrefab('paginator', paginator)

// ------

export const knowledge = definePrefabKnowledge<PaginatorAttributes>((utils) => {
  utils.name('paginator')
  utils.description('Divide multiple content to cards switched by clicking tab.')
  utils.prop('default')
    .describe('the default tab')
    .type('string')
  utils.slot('tab:<name>', 'A tab, <name> will be the name of the tab')
})

addPrefabKnowledge(knowledge)
