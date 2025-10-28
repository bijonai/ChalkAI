import { BaseCanvasElementAttributes, createCanvasElementContainer, Vector2 } from "@chalk-dsl/canvas"
import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core"
import { theme } from "@chalk-dsl/utils-theme"
import * as d3 from 'd3'
import { arrow } from "./vector"
import { definePrefabKnowledge } from "@chalk-dsl/knowledge"
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default"

export interface RulerOptions {
  direction?: 'x' | 'y'
  division?: number
  offset?: number
  counter?: (count: number) => string
  textSize?: number
}
export const ruler = (
  range: Vector2,
  selection: d3.Selection<SVGGElement, unknown, null, unknown>,
  options: RulerOptions = {}
) => {
  const direction = options.direction ?? 'x'
  const division = options.division ?? 1
  const offset = options.offset ?? 0
  const counter = options.counter ?? ((count: number) => count.toString())
  const textSize = options.textSize ? String(options.textSize) : theme.size('xs')
  const [start, end] = range
  selection.attr('text-anchor', 'middle')
  selection.attr('dominant-baseline', 'middle')
  selection.attr('font-size', textSize)
  for (let i = start; i <= end; i += 1) {
    if (i === 0 && direction === 'y') continue
    const value = counter(i)
    selection.append('text')
      .text(value)
      .attr(direction, i * division)
      .attr(['x', 'y'][Number(direction === 'x')], offset)
  }
}

export interface AxisAttributes extends BaseCanvasElementAttributes {
  range: Vector2
}

const axis = definePrefab<'axis', AxisAttributes, { division: Vector2 }>((context) => {
  return {
    name: 'axis',
    generator: (attrs) => {
      const root = createCanvasElementContainer(attrs, context.division)
      const [xDivision] = context.division
      
      arrow(
        attrs.range[0] * xDivision, 0, attrs.range[1] * xDivision, 0,
        d3.select(root).append('g')
          .attr('stroke', 'none')
          .attr('fill', 'black')
      )
      ruler(
        attrs.range,
        d3.select(root).append('g')
          .attr('stroke', 'none')
          .attr('fill', 'black'),
        {
          direction: 'x',
          division: xDivision,
          offset: 10,
          counter: (count: number) => count.toString(),
        }
      )

      const ticks = d3.select(root).append('g')
        .attr('stroke', 'black')

      for (let i = attrs.range[0]; i < attrs.range[1]; i++) {
        ticks.append('line')
          .attr('x1', i * xDivision)
          .attr('y1', 0)
          .attr('x2', i * xDivision)
          .attr('y2', -5)
      }

      return root
    }
  }
})

registerPrefab('axis', axis)

export default axis

// ------

export const knowledge = definePrefabKnowledge<AxisAttributes>((utils) => {
  utils.name('axis')
  utils.description('A axis under `canvas`')
  utils.prop('range')
    .describe('The range of the axis')
    .type('[number, number]')
  utils.rule('`axis` must be used under a `canvas` element')
  utils.rule('`axis` is a single line axis, not use it under a `plane` element')
})

addPrefabKnowledge(knowledge)