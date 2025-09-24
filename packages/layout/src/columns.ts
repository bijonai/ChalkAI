import { definePrefabKnowledge } from "@chalk-dsl/knowledge"
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default"
import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core"

export interface ColumnAttributes {
  gap: string | number
  columns?: number[]
}

export const columns = definePrefab<'columns', ColumnAttributes>((ctx) => {
  return {
    name: 'columns',
    generator: (props, children) => {
      const column = document.createElement('div')
      column.style.display = 'grid'
      column.style.width = '100%'
      const kids = children()
      column.style.gridTemplateRows = props.columns
        ? props.columns.map((c) => `${c}fr`).join(' ')
        : kids.map(() => '1fr').join(' ')
      column.style.gap = props.gap.toString()
      column.append(...kids)
      return column
    },
    defaults: {
      gap: 0,
    }
  }
})

registerPrefab('columns', columns)

// ------

addPrefabKnowledge(
  definePrefabKnowledge((utils) => {
    utils.name('columns')
    utils.description('A column of elements')
    utils.tag('layout')
    utils.prop('gap')
      .describe('The gap between the elements')
      .type('string | number').optional('0')
    utils.prop('columns')
      .describe('The column distribution values')
      .type('number[]').optional()
  })
)