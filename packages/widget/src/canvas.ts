import { definePrefab, ref, registerPrefab, useAttributes } from "@chalk-dsl/renderer-core";
import { definePrefabKnowledge } from "@chalk-dsl/knowledge";
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default";

export type Vector2 = [number, number]

export interface CanvasAttributes {
  origin: Vector2
  division: number | Vector2
  range?: Vector2
  domain?: Vector2
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
    generator: (attrs, children, { mount }) => {
      const canvas = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement
      canvas.style.width = '100%'


      const root = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      canvas.append(root)

      root.append(...children())

      mount(() => {
        const bbox = root.getBBox()
        const canvasRect = canvas.getBoundingClientRect()

        const x = attrs.domain ? attrs.domain[0] : bbox.x
        const y = attrs.range ? attrs.range[0] : bbox.y
        const width = attrs.domain ? attrs.domain[1] - attrs.domain[0] : bbox.width
        const height = attrs.range ? attrs.range[1] - attrs.range[0] : bbox.height

        canvas.setAttribute('viewBox', `${x} ${y} ${width} ${height}`)

        const aspectRatio = height / width
        const canvasHeight = canvasRect.width * aspectRatio
        canvas.style.height = `${canvasHeight}px`

        canvas.setAttribute('width', String(canvasRect.width))
        canvas.setAttribute('height', String(canvasHeight))
      })

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
  utils.prop('origin')
    .describe('The origin of the canvas')
    .type('[number, number]')
    .optional('[0, 0]')
})

addPrefabKnowledge(knowledge)
