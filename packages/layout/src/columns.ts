import { definePrefabKnowledge } from "@chalk-dsl/knowledge"
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default"
import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core"
import block, { BlockAttributes, knowledge as blockKnowledge } from "./block"
import { theme } from "@chalk-dsl/utils-theme"

export interface ColumnAttributes extends BlockAttributes {
  gap: string | number
  columns?: number[] | number
}

export const columns = definePrefab<'columns', ColumnAttributes>((context, _) => {
  return {
    name: 'columns',
    generator: (props, children) => {
      const column = <HTMLDivElement>block(context, _).generator(props, children)
      column.style.display = 'flex'
      column.style.flexDirection = 'column'
      column.style.width = '100%'
      const kids = children()
      column.style.flexWrap = 'wrap'
      console.log(theme.size(props.gap.toString()))
      column.style.gap = theme.size(props.gap.toString())
      column.append(...kids)
      return column
    },
    defaults: {
      gap: 'md',
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