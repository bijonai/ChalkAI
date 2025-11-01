import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core"
import { BaseCanvasElementAttributes, baseCanvasElementKnowledge, createCanvasElementContainer, Fillable, fillableKnowledge, Strokeable, strokeableKnowledge, Vector2 } from "./shared"
import * as d3 from 'd3'
import { definePrefabKnowledge } from "@chalk-dsl/knowledge"
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default"

export interface RectAttributes extends BaseCanvasElementAttributes, Fillable, Strokeable {
  width: number
  height: number
}

export const rect = definePrefab<'rect', RectAttributes, { division: Vector2 }>((context) => {
  return {
    name: 'rect',
    generator: (attrs) => {
      const root = createCanvasElementContainer(attrs, context.division)
      const [xDivision, yDivision] = context.division

      d3.select(root).append('rect')
        .attr('width', attrs.width * xDivision)
        .attr('height', attrs.height * yDivision)

      return root
    }
  }
})

registerPrefab('rect', rect)

export default rect

// ------

export const knowledge = definePrefabKnowledge<RectAttributes>((utils) => {
  utils.name('rect')
  utils.description('Rect, used in canvas')
  utils.extend(baseCanvasElementKnowledge)
  utils.extend(fillableKnowledge)
  utils.extend(strokeableKnowledge)

  utils.prop('width')
    .describe('The width of the rect')
    .type('number')

  utils.prop('height')
    .describe('The height of the rect')
    .type('number')
})
addPrefabKnowledge(knowledge)