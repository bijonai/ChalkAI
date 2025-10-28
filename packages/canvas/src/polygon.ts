import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core"
import { BaseCanvasElementAttributes, baseCanvasElementKnowledge, createCanvasElementContainer, fillableKnowledge, Fillable, Strokeable, strokeableKnowledge, Vector2 } from "./shared"
import * as d3 from 'd3'
import { definePrefabKnowledge } from "@chalk-dsl/knowledge"
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default"

export interface PolygonAttributes extends BaseCanvasElementAttributes, Strokeable, Fillable {
  points: Vector2[]
}

const polygon = definePrefab<'polygon', PolygonAttributes, { division: Vector2 }>((context) => {
  return {
    name: 'polygon',
    generator: (attrs) => {
      const root = createCanvasElementContainer(attrs, context.division)
      const [xDivision, yDivision] = context.division

      const generatePath = () => attrs.points.map(
        ([x, y], index) => index === 0 ? `M${x * xDivision},${y * yDivision}` : `L${x * xDivision},${y * yDivision}`
      ).join(' ') + ' Z'

      d3.select(root).append('path')
        .attr('d', generatePath())

      return root
    }
  }
})

registerPrefab('polygon', polygon)

export default polygon

// ------

export const knowledge = definePrefabKnowledge<PolygonAttributes>((utils) => {
  utils.name('polygon')
  utils.description('Polygon, used in canvas')
  utils.extend(baseCanvasElementKnowledge)
  utils.extend(strokeableKnowledge)
  utils.extend(fillableKnowledge)

  utils.prop('points')
    .describe('The points of the polygon')
    .type('[number, number][]')
})
addPrefabKnowledge(knowledge)
