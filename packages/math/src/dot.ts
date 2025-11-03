import { BaseCanvasElementAttributes, createCanvasElementContainer, Vector2 } from "@chalk-dsl/canvas";
import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core";
import * as d3 from 'd3'
import { tex } from "./tex";
import { theme } from "@chalk-dsl/utils-theme";
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default";
import { definePrefabKnowledge } from "@chalk-dsl/knowledge";

export interface DotAttributes extends BaseCanvasElementAttributes {
  color?: string
  label?: string
}

const dot = definePrefab<'dot', DotAttributes, { division: Vector2 }>((context) => {
  return {
    name: 'dot',
    generator: (attrs, children, { mount }) => {
      const root = createCanvasElementContainer(attrs, context.division)

      if (attrs.label) {
        const [label, mounted] = tex(attrs.label, attrs.color)
        d3.select(root).append(() => label)
        mount(mounted)
      }

      root.setAttribute('stroke', 'none')
      d3.select(root)
        .append('circle')
        .attr('r', 5)
        .attr('fill', theme.pallete(attrs.color ?? 'primary'))
        .attr('fill-opacity', '1.0')
      return root
    },
  }
})

registerPrefab('dot', dot)
export default dot

export const knowledge = definePrefabKnowledge((utils) => {
  utils.name('dot')
  utils.description('A dot')
  utils.prop('label')
    .describe('The label of the dot')
    .optional()
  utils.prop('color')
    .describe('The color of the dot')
    .optional('primary')
  utils.prop('position')
    .describe('Position of the dot')
    .type('[number, number]')
  utils.rule("`dot` must be used under a `canvas` element.")
})
addPrefabKnowledge(knowledge)

