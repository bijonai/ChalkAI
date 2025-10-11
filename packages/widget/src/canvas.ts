import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core";
import { definePrefabKnowledge } from "@chalk-dsl/knowledge";

export type Vector2 = [number, number]

export interface CanvasAttributes {
  range: Vector2 // Y-axis
  domain: Vector2 // X-axis
  origin: Vector2
}

const canvas = definePrefab<'canvas', CanvasAttributes>(() => {
  return {
    name: 'canvas',
    generator: (attrs, children) => {
      const canvas = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement
      canvas.style.width = '100%'

      canvas.setAttribute('viewBox', `${attrs.domain[0]} ${attrs.domain[1]} ${attrs.range[0]} ${attrs.range[1]}`)
      
      const root = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      root.setAttribute('transform', `translate(${attrs.origin[0]}, ${attrs.origin[1]})`)
      canvas.append(root)

      root.append(...children())
      return canvas
    },
    defaults: {
      origin: [0, 0],
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
  return utils.toKnowledge()
})
