import { definePrefabKnowledge } from "@chalk-dsl/knowledge"
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default"
import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core"
import block, { BlockAttributes, knowledge as blockKnowledge } from "./block"

export interface ColumnAttributes extends BlockAttributes {
  gap: string | number
  columns?: number[]
}

export const columns = definePrefab<'columns', ColumnAttributes>((context) => {
  return {
    name: 'columns',
    generator: (props, children) => {
      const column = <HTMLDivElement>block(context).generator(props, children)
      column.style.display = 'grid'
      column.style.width = '100%'
      const kids = children()
      column.style.gridTemplateRows = props.columns
        ? props.columns.map((c) => `${c}fr`).join(' ')
        : kids.map(() => '1fr').join(' ')
      column.style.gap = props.gap.toString()
      return column
    },
    defaults: {
      gap: 0,
    }
  }
})

registerPrefab('columns', columns)

export default columns

// ------

export const knowledge = definePrefabKnowledge((utils) => {
  utils.name('columns')
  utils.description('A column of elements')
  utils.extend(blockKnowledge)
  utils.prop('gap')
    .describe('The gap between the elements')
    .type('string | number').optional('0')
  utils.prop('columns')
    .describe('The column distribution values')
    .type('number[]').optional()
})
addPrefabKnowledge(knowledge)