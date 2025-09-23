import { definePrefabKnowledge } from "@chalk-dsl/knowledge"
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default"
import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core"

export interface RowAttributes {
  gap: string | number
}

const row = definePrefab<'row', RowAttributes>((ctx) => {
  return {
    name: 'row',
    generator: (props, children) => {
      const row = document.createElement('div')
      row.style.display = 'grid'
      row.style.width = '100%'
      const kids = children()
      row.style.gridTemplateColumns = kids.map(() => '1fr').join(' ')
      row.style.gap = props.gap.toString()
      row.append(...kids)
      return row
    },
    defaults: {
      gap: 0
    }
  }
})

registerPrefab('row', row)

// ------

addPrefabKnowledge(
  definePrefabKnowledge((utils) => {})
)
