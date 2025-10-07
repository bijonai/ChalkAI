import { definePrefabKnowledge } from "@chalk-dsl/knowledge"
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default"
import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core"
import block, { BlockAttributes, knowledge as blockKnowledge } from "./block"

export interface RowAttributes extends BlockAttributes {
  gap: string | number
  rows?: number[]
}

const rows = definePrefab<'rows', RowAttributes>((context, _) => {
  return {
    name: 'rows',
    generator: (props, children) => {
      const row = <HTMLDivElement>block(context, _).generator(props, children)
      row.style.display = 'flex'
      row.style.width = '100%'
      row.style.flexDirection = 'row'
      const kids = children()
      row.style.flexWrap = 'wrap'
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

export default rows

// ------

export const knowledge = definePrefabKnowledge((utils) => {
  utils.name('rows')
  utils.description('A row of elements')
  utils.extend(blockKnowledge)
  utils.prop('gap')
    .describe('The gap between the elements')
    .type('string | number').optional('0')
  utils.prop('rows')
    .describe('The row distribution values')
    .type('number[]').optional()
})

addPrefabKnowledge(knowledge)
