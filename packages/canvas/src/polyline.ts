import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core"
import { BaseCanvasElementAttributes, baseCanvasElementKnowledge, createCanvasElementContainer, Strokeable, strokeableKnowledge, Vector2 } from "./shared"
import * as d3 from 'd3'
import { definePrefabKnowledge } from "@chalk-dsl/knowledge"
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default"

export interface PolylineAttributes extends BaseCanvasElementAttributes, Strokeable {
  points: Vector2[]
}

const polyline = definePrefab<'polyline', PolylineAttributes, { division: Vector2 }>((context) => {
  return {
    name: 'polyline',
    generator: (attrs) => {
      const root = createCanvasElementContainer(attrs, context.division)
      const [xDivision, yDivision] = context.division

      const generatePath = () => attrs.points.map(
        ([x, y], index) => index === 0 ? `M${x * xDivision},${y * yDivision}` : `L${x * xDivision},${y * yDivision}`
      ).join(' ')

      d3.select(root).append('path')
        .attr('d', generatePath())

      return root
    }
  }
})

registerPrefab('polyline', polyline)

export default polyline

// ------

export const knowledge = definePrefabKnowledge<PolylineAttributes>((utils) => {
  utils.name('polyline')
  utils.description('Polyline, used in canvas')
  utils.extend(baseCanvasElementKnowledge)
  utils.extend(strokeableKnowledge)

  utils.prop('points')
    .describe('The points of the polyline')
    .type('[number, number][]')
})
addPrefabKnowledge(knowledge)
