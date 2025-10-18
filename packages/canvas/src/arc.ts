import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core";
import { definePrefabKnowledge } from "@chalk-dsl/knowledge";
import { BaseCanvasElementAttributes, baseCanvasElementKnowledge, createCanvasElementContainer, fillableKnowledge, Fillable, Strokeable, strokeableKnowledge, Vector2 } from "./shared";
import * as d3 from 'd3'
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default";
import { theme } from "@chalk-dsl/utils-theme";

export interface ArcAttributes
  extends BaseCanvasElementAttributes, Fillable, Strokeable {
  start: number
  end: number
  radius: number
}

const arc = definePrefab<'arc', ArcAttributes, { division: Vector2 }>((context) => {
  return {
    name: 'arc' as const,
    generator: (attrs) => {
      const root = createCanvasElementContainer(attrs, context.division)
      console.log(context.division)
      const [xDivision, yDivision] = context.division

      // State division
      const xRadius = xDivision * attrs.radius

      // Convert degrees to radians for d3.arc()
      const currentStartAngle = (attrs.start * Math.PI) / 180
      const currentEndAngle = (attrs.end * Math.PI) / 180

      // Function to update the arc path
      const updateArcPath = (startAngle: number, endAngle: number) => {
        if (startAngle > endAngle) {
          endAngle += 2 * Math.PI
        }
        const pathData = d3.arc()({
          startAngle: startAngle + Math.PI / 2, // Math convention to Compass convention
          endAngle: endAngle + Math.PI / 2,
          innerRadius: 0,  // innerRadius should be 0 for a filled arc
          outerRadius: xRadius,
        })
        d3.select(root).select('path')
          .attr('d', pathData)
      }

      // init arc path
      d3.select(root).append('path')
      updateArcPath(currentStartAngle, currentEndAngle)

      return root
    },
    defaults: {
      start: 0,
      end: 360,
    }
  }
})

registerPrefab('arc', arc)

export default arc

// ------

export const knowledge = definePrefabKnowledge<ArcAttributes>((utils) => {
  utils.name('arc')
  utils.description('Arc (circle), used in canvas')
  utils.extend(baseCanvasElementKnowledge)
  utils.extend(fillableKnowledge)
  utils.extend(strokeableKnowledge)

  utils.prop('start')
    .describe('the start angle of the arc')
    .type('number')
    .optional('0')
  utils.prop('end')
    .describe('the end angle of the arc')
    .type('number')
    .optional('360')
  utils.prop('radius')
    .describe('the radius of the arc')
    .type('number')
})

addPrefabKnowledge(knowledge)
