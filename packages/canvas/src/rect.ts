import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core"
import { BaseCanvasElementAttributes, baseCanvasElementKnowledge, createCanvasElementContainer, Fillable, fillableKnowledge, Strokeable, strokeableKnowledge, Vector2 } from "./shared"
import * as d3 from 'd3'
import { definePrefabKnowledge } from "@chalk-dsl/knowledge"
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default"

export interface RectAttributes extends BaseCanvasElementAttributes, Fillable, Strokeable {
  width: number
  height: number
  align: 'left' | 'center' | 'right'
  baseline: 'top' | 'middle' | 'bottom'
}

export const rect = definePrefab<'rect', RectAttributes, { division: Vector2 }>((context) => {
  return {
    name: 'rect',
    generator: (attrs) => {
      const root = createCanvasElementContainer(attrs, context.division)
      const [xDivision, yDivision] = context.division

      const width = attrs.width * xDivision
      const height = attrs.height * Math.abs(yDivision)
      const offsetX = attrs.align === 'left' ? 0 : attrs.align === 'center' ? width / 2 : width
      const offsetY = attrs.baseline === 'top' ? 0 : attrs.baseline === 'middle' ? height / 2 : height
      d3.select(root).append('path')
        .attr('d', `M${offsetX},${offsetY} L${width + offsetX},${offsetY} L${width + offsetX},${height + offsetY} L${offsetX},${height + offsetY} Z`)

      return root
    },
    defaults: {
      align: 'center',
      baseline: 'middle'
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

  utils.prop('align')
    .describe('The alignment of the rect, for example, "left" means the left edge of the rect is at the origin')
    .type('"left" | "center" | "right"')
    .optional('center')

  utils.prop('baseline')
    .describe('The baseline of the rect, for example, "top" means the top edge of the rect is at the origin')
    .type('"top" | "middle" | "bottom"')
    .optional('middle')
})
addPrefabKnowledge(knowledge)