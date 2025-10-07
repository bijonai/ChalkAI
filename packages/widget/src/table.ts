import { definePrefabKnowledge } from "@chalk-dsl/knowledge"
import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core"

export type TableAttributes = {
  direction: 'horizontal' | 'vertical'
  columns: number | number[]
  rows: number | number[]
  gap: string | number
}

const table = definePrefab<'table', TableAttributes>(() => {
  return {
    name: 'table',
    generator: (attrs, children) => {
      const table = document.createElement('div')
      table.style.display = 'grid'
      table.style.width = '100%'
      table.style.gridTemplateColumns = attrs.direction === 'horizontal' ? Array.isArray(attrs.columns) ? attrs.columns.map((c) => `${c}fr`).join(' ') : `${attrs.columns}fr` : '1fr'
      table.style.gridTemplateRows = attrs.direction === 'vertical' ? Array.isArray(attrs.rows) ? attrs.rows.map((r) => `${r}fr`).join(' ') : `${attrs.rows}fr` : '1fr'
      table.style.gap = attrs.gap.toString()
      table.append(...children().map((c) => {
        (c as HTMLElement).style.border = '1px solid #ccc'
        return c
      }))

      return table
    },
    defaults: {
      gap: 0,
    }
  }
})

export default table

registerPrefab('table', table)

// ------

export const knowledge = definePrefabKnowledge<TableAttributes>((utils) => {
  utils.name('table')
  utils.description('A table widget')
  utils.prop('gap')
    .describe('the gap of the table')
    .type('string | number')
    .optional()
  utils.prop('direction')
    .describe('the direction of the table')
    .type('horizontal | vertical')
    .optional()
  utils.prop('columns')
    .describe('the columns of the table, when direction is horizontal')
    .type('number | number[]')
    .optional()
  utils.prop('rows')
    .describe('the rows of the table, when direction is vertical')
    .type('number | number[]')
    .optional()
  utils.rule('Children node will be the table cells')
})