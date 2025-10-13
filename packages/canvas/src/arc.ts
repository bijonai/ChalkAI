import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core";
import { definePrefabKnowledge } from "@chalk-dsl/knowledge";
import { BaseCanvasElementAttributes, baseCanvasElementKnowledge, createCanvasElementContainer, fillableKnowledge, Fillable, Strokeable, strokeableKnowledge } from "./shared";
import * as d3 from 'd3'
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default";

export interface ArcAttributes extends BaseCanvasElementAttributes, Fillable, Strokeable {
  start: number
  end: number
  radius: number
}

const arc = definePrefab<'arc', ArcAttributes>(() => {
  return {
    name: 'arc',
    generator: (attrs) => {
      const root = createCanvasElementContainer(attrs)
        
      root.append('path')
        .attr('d', d3.arc()({
          startAngle: attrs.start,
          endAngle: attrs.end,
          innerRadius: attrs.radius,
          outerRadius: attrs.radius,
        }))

      return root.node()!
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
