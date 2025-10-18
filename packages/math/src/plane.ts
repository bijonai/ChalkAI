import { BaseCanvasElementAttributes, createCanvasElementContainer, Vector2 } from "@chalk-dsl/canvas"
import { computed, definePrefab, ref, registerPrefab } from "@chalk-dsl/renderer-core"
import * as d3 from 'd3'
import { arrow } from "./vector"
import { definePrefabKnowledge } from "@chalk-dsl/knowledge"
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default"

export interface PlaneAttributes extends BaseCanvasElementAttributes {
  range: Vector2
  domain: Vector2
}

const plane = definePrefab<'plane', PlaneAttributes, { division: Vector2 }>((context) => {
  console.log(context.division, 'context.division')
  const division = [
    context.division[0],
    context.division[1] * -1,
  ]
  context.division = <Vector2>division
  return {
    name: 'plane',
    generator: (attrs, children) => {
      const root = createCanvasElementContainer(attrs, division)

      const selection = d3.select(root)

      // Grid
      const grid = selection.append('g')
        .attr('stroke', 'gray')
        .attr('stroke-width', 0.5)
      for (let i = attrs.domain[0]; i <= attrs.domain[1]; i++) {
        grid.append('line')
          .attr('x1', i * division[0])
          .attr('y1', attrs.range[0] * division[1])
          .attr('x2', i * division[0])
          .attr('y2', attrs.range[1] * division[1])
      }
      for (let i = attrs.range[0]; i <= attrs.range[1]; i++) {
        grid.append('line')
          .attr('x1', attrs.domain[0] * division[0])
          .attr('y1', i * division[1])
          .attr('x2', attrs.domain[1] * division[0])
          .attr('y2', i * division[1])
      }

      // X Axis
      arrow(
        attrs.domain[0] * division[0], 0, attrs.domain[1] * division[0], 0,
        selection.append('g')
      )

      // Y Axis
      arrow(
        0, attrs.range[0] * division[1], 0, attrs.range[1] * division[1],
        selection.append('g')
      )

      // Children
      children().forEach((child) => {
        d3.select(root).append(() => child)
      })

      return root
    },
    provides: {
      division,
    }
  }
})

export default plane
registerPrefab('plane', plane)

// ------

export const knowledge = definePrefabKnowledge((utils) => {
  utils.name('plane')
  utils.description('A plane widget')
  utils.prop('range')
    .describe('The range of the plane')
    .type('[number, number]')
  utils.prop('domain')
    .describe('The domain of the plane')
    .type('[number, number]')
  utils.rule('The y coordinate of `canvas` is downward by default, but the y coordinate of `plane` is upward. The y coordinates of all subcomponents under the plane will be automatically flipped.')
})

addPrefabKnowledge(knowledge)
