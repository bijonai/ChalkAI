import { definePrefab, ref, registerPrefab, useAttributes } from "@chalk-dsl/renderer-core";
import { definePrefabKnowledge } from "@chalk-dsl/knowledge";
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default";

export type Vector2 = [number, number]

export interface CanvasAttributes {
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
    generator: (attrs, children, { mount }) => {
      const canvas = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement
      canvas.style.width = '100%'


      const root = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      canvas.append(root)

      root.append(...children())

      mount(() => {
        const bbox = root.getBBox()
        const canvasRect = canvas.getBoundingClientRect()

        canvas.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`)

        const aspectRatio = bbox.height / bbox.width
        const height = canvasRect.width * aspectRatio
        canvas.style.height = `${height}px`

        canvas.setAttribute('width', String(canvasRect.width))
        canvas.setAttribute('height', String(height))
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
