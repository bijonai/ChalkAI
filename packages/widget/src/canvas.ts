import { definePrefab, ref, registerPrefab, useAttributes } from "@chalk-dsl/renderer-core";
import { definePrefabKnowledge } from "@chalk-dsl/knowledge";
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default";

export type Vector2 = [number, number]

export interface CanvasAttributes {
  range: Vector2 // Y-axis
  domain: Vector2 // X-axis
  origin: Vector2
  division: number | Vector2
}

const canvas = definePrefab<'canvas', CanvasAttributes>((context) => {
  const { division: divisionAttr } = useAttributes<CanvasAttributes>(context)
  const division = ref<Vector2>(
    divisionAttr
      ? Array.isArray(divisionAttr) ? divisionAttr : [divisionAttr, divisionAttr]
      : [10, 10]
  )
  return {
    name: 'canvas',
    provides: {
      division,
    },
    generator: (attrs, children) => {
      const canvas = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement
      canvas.style.width = '100%'
      const origin = attrs.origin || [
        attrs.domain[1] / 2,
        attrs.range[1] / 2
      ]

      const [xDivision, yDivision] = division.value

      canvas.setAttribute(
        'viewBox',
        `0 0 ${(attrs.domain[1] - attrs.domain[0])} ${(attrs.range[1] - attrs.range[0])}`
      )
      
      const root = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      root.setAttribute('transform', `translate(${(origin[0] - attrs.domain[0])}, ${(origin[1] - attrs.range[0])})`)
      canvas.append(root)

      root.append(...children())
      return canvas
    },
    defaults: {
      // origin: [0, 0],
      division: 20,
    }
  }
})

registerPrefab('canvas', canvas)

export default canvas

// ------

export const knowledge = definePrefabKnowledge<CanvasAttributes>((utils) => {
  utils.name('canvas')
  utils.description('A canvas widget')
  utils.prop('range')
    .describe('The range of the canvas')
    .type('[number, number]')
  utils.prop('domain')
    .describe('The domain of the canvas')
    .type('[number, number]')
  utils.prop('origin')
    .describe('The origin of the canvas')
    .type('[number, number]')
    .optional('[0, 0]')
})

addPrefabKnowledge(knowledge)
