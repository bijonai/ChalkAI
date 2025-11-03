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
      : [30, 30]
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
      root.style.vectorEffect = 'non-scaling-stroke'

      const container = document.createElement('div')
      container.append(canvas)
      container.style.minWidth = '100%'
      container.style.display = 'flex'
      container.style.justifyContent = 'center'
      container.style.alignItems = 'center'

      mount(() => {
        const CANVAS_PADDING = 10
        const bbox = root.getBBox()
        const canvasRect = canvas.getBoundingClientRect()

        const width = attrs.domain ? attrs.domain[1] - attrs.domain[0] : bbox.width
        const height = attrs.range ? attrs.range[1] - attrs.range[0] : bbox.height

        root.setAttribute('transform', `translate(${canvasRect.width / 2 + CANVAS_PADDING}, ${height / 2 + CANVAS_PADDING})`);

        canvas.style.height = `${height + CANVAS_PADDING * 2}px`

        container.style.minWidth = `${width + CANVAS_PADDING * 2}px`
        container.style.minHeight = `${height + CANVAS_PADDING * 2}px`

        canvas.setAttribute('width', String(canvasRect.width))
      })
      
      return container
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
