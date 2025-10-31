import { BaseCanvasElementAttributes, createCanvasElementContainer, Vector2 } from "@chalk-dsl/canvas";
import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core";
import * as d3 from 'd3'
import { tex } from "./tex";

export interface DotAttributes extends BaseCanvasElementAttributes {
  color: string
}

const dot = definePrefab<'dot', DotAttributes, { division: Vector2 }>((context) => {
  return {
    name: 'dot',
    generator: (attrs, children, { mount }) => {
      const root = createCanvasElementContainer(attrs, context.division)
      const [xDivision, yDivision] = context.division

      const [label, mounted] = tex('A + B = C', attrs.color)

      d3.select(root).append(() => label)
      mount(mounted)
      return root
    },
  }
})

registerPrefab('dot', dot)
export default dot
