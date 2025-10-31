import { BaseCanvasElementAttributes, createCanvasElementContainer, Vector2 } from "@chalk-dsl/canvas";
import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core";
import * as d3 from 'd3'
import { tex } from "./tex";
import { theme } from "@chalk-dsl/utils-theme";

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
      return root
    },
  }
})

registerPrefab('dot', dot)
export default dot
