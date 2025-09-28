import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core";
import { definePrefabKnowledge } from "@chalk-dsl/knowledge";
import block, { BlockAttributes, knowledge as blockKnowledge } from "./block";
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default";

export interface GridAttributes extends BlockAttributes {
  columns?: number | number[]
  rows?: number | number[]
  gap?: string | number
  gapX?: string | number
  gapY?: string | number
}

const grid = definePrefab<'grid', GridAttributes>((context, _) => {
  return {
    name: 'grid',
    generator: (props, children) => {
      const grid = <HTMLDivElement>block(context, _).generator(props, children)
      grid.style.display = 'grid'
      grid.style.width = '100%'
      const kids = children()
      grid.style.gridTemplateColumns = props.columns
        ? Array.isArray(props.columns)
          ? props.columns.map((c) => `${c}fr`).join(' ')
          : Array.from({ length: props.columns }, () => '1fr').join(' ')
        : kids.map(() => '1fr').join(' ')
      grid.style.gridTemplateRows = props.rows
        ? Array.isArray(props.rows)
          ? props.rows.map((r) => `${r}fr`).join(' ')
          : Array.from({ length: props.rows }, () => '1fr').join(' ')
        : kids.map(() => '1fr').join(' ')
      grid.style.gap = props.gap?.toString() ?? '0'
      grid.style.rowGap = props.gapX?.toString() ?? '0'
      grid.style.columnGap = props.gapY?.toString() ?? '0'
      return grid
    },
    defaults: {
      gap: 0,
      gapX: 0,
      gapY: 0,
    }
  }
})

registerPrefab('grid', grid)
export default grid

// ------

export const knowledge = definePrefabKnowledge<GridAttributes>((utils) => {
  utils.name('grid')
  utils.description('A grid layout')
  utils.extend(blockKnowledge)
  utils.prop('columns').describe('The number of columns to create').type('number | number[]').optional()
  utils.prop('rows').describe('The number of rows to create').type('number | number[]').optional()
  utils.prop('gap').describe('The gap between the grid items').type('number').optional()
  utils.prop('gapX').describe('The gap between the grid items on the x-axis').type('number').optional()
  utils.prop('gapY').describe('The gap between the grid items on the y-axis').type('number').optional()
  return utils.toKnowledge()
})

addPrefabKnowledge(knowledge)
