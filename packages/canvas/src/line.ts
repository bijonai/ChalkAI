import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core";
import { BaseCanvasElementAttributes, baseCanvasElementKnowledge, createCanvasElementContainer, Strokeable, strokeableKnowledge, Vector2 } from "./shared";
import * as d3 from 'd3'
import { definePrefabKnowledge } from "@chalk-dsl/knowledge";
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default";

export interface LineAttributes extends BaseCanvasElementAttributes, Strokeable {
  from: Vector2
  to: Vector2
}

const line = definePrefab<'line'>(() => {
  return {
    name: 'line',
    generator: (attrs) => {
      const root = createCanvasElementContainer(attrs)

      d3.select(root)
        .append('line')
        .attr('x1', attrs.from[0])
        .attr('y1', attrs.from[1])
        .attr('x2', attrs.to[0])
        .attr('y2', attrs.to[1])

      return root
    }
  }
})

registerPrefab('line', line)

export default line

// ------

export const knowledge = definePrefabKnowledge<LineAttributes>((utils) => {
  utils.extend(baseCanvasElementKnowledge)
  utils.extend(strokeableKnowledge)
  utils.name('line')

  utils.prop('from').type('[number, number]')
    .describe('The starting point of the line')
  utils.prop('to').type('[number, number]')
    .describe('The ending point of the line')
})

addPrefabKnowledge(knowledge)
