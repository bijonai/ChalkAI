import { createCanvasElementContainer, type BaseCanvasElementAttributes, type Vector2 } from "@chalk-dsl/canvas";
import { definePrefabKnowledge } from "@chalk-dsl/knowledge";
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default";
import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core";
import { theme } from "@chalk-dsl/utils-theme";
import * as d3 from 'd3'

export const arrow = (
  x1: number, y1: number,
  x2: number, y2: number,
  selection: d3.Selection<SVGGElement, unknown, null, any>,
  color: string = theme.pallete('primary')
) => {
  selection.append('line')
    .attr('x1', x1)
    .attr('y1', y1)
    .attr('x2', x2)
    .attr('y2', y2)
    .attr('stroke', color)

  selection.append('polygon')
    .attr('points', '0,0 -5,3 7,0 -5,-3 0,0')
    .attr(
      'transform',
      `translate(${x2}, ${y2}) rotate(${Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI})`
    )
    .attr('fill', color)
    .attr('fill-opacity', 1)
    .attr('stroke', 'none')

  return selection
}

export interface VectorAttributes extends BaseCanvasElementAttributes {
  from: Vector2
  to: Vector2
  color: string
}

const vector = definePrefab<'vector', VectorAttributes, { division: Vector2 }>((context) => {
  return {
    name: 'vector',
    generator: (attrs) => {
      const root = createCanvasElementContainer(attrs, context.division)
      const [xDivision, yDivision] = context.division

      arrow(
        attrs.from[0] * xDivision, attrs.from[1] * yDivision,
        attrs.to[0] * xDivision, attrs.to[1] * yDivision,
        d3.select(root),
        theme.pallete(attrs.color)
      )

      return root
    },
    defaults: {
      color: 'primary',
    }
  }
})

registerPrefab('vector', vector)

export default vector

// ------

export const knowledge = definePrefabKnowledge<VectorAttributes>((utils) => {
  utils.name('vector')
  utils.description('A vector under `canvas`')
  utils.prop('from')
    .describe('The starting point of the vector')
    .type('[number, number]')
  utils.prop('to')
    .describe('The ending point of the vector')
    .type('[number, number]')
  utils.prop('color')
    .describe('The color of the vector')
    .type('string')
    .optional('primary')
  utils.rule('`vector` must be used under a `canvas` element')
})

addPrefabKnowledge(knowledge)
