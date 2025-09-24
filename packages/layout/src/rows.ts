import { definePrefabKnowledge } from "@chalk-dsl/knowledge"
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default"
import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core"

export interface RowAttributes {
  gap: string | number
  rows?: number[]
}

const rows = definePrefab<'rows', RowAttributes>((ctx) => {
  return {
    name: 'rows',
    generator: (props, children) => {
      const row = document.createElement('div')
      row.style.display = 'grid'
      row.style.width = '100%'
      const kids = children()
      row.style.gridTemplateColumns = props.rows
        ? props.rows.map((r) => `${r}fr`).join(' ')
        : kids.map(() => '1fr').join(' ')
      row.style.gap = props.gap.toString()
      row.append(...kids)
      return row
    },
    defaults: {
      gap: 0,
    }
  }
})

registerPrefab('rows', rows)

// ------

addPrefabKnowledge(
  definePrefabKnowledge((utils) => {
    utils.name('rows')
    utils.description('A row of elements')
    utils.tag('layout')
    utils.prop('gap')
      .describe('The gap between the elements')
      .type('string | number').optional('0')
    utils.prop('rows')
      .describe('The row distribution values')
      .type('number[]').optional()
  })
)
