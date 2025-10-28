import { definePrefabKnowledge } from '@chalk-dsl/knowledge'
import { theme } from '@chalk-dsl/utils-theme'

export type Vector2 = [number, number]
export type Vector3 = [number, number, number]

export interface BaseCanvasElementAttributes {
  position?: Vector2
  rotation?: number
  scale?: number | Vector2
}

export interface Fillable {
  fill?: string
  fillOpacity?: number // [0, 1]
}

export interface Strokeable {
  stroke?: string
  strokeWidth?: number
  strokeOpacity?: number // [0, 1]
}

export const createCanvasElementContainer = <
  T extends BaseCanvasElementAttributes,
  F extends Fillable,
  S extends Strokeable
>(attrs: T & Partial<F & S>, division: Vector2) => {
  attrs.position ??= [0, 0]
  attrs.rotation ??= 0
  const scale = attrs.scale ? Array.isArray(attrs.scale) ? attrs.scale : [attrs.scale, attrs.scale] : [1, 1]

  const container = document.createElementNS('http://www.w3.org/2000/svg', 'g') as SVGGElement

  container.setAttribute(
    'transform',
    `translate(${attrs.position[0] * division[0]}, ${attrs.position[1] * division[1]}) rotate(${attrs.rotation}) scale(${scale[0]}, ${scale[1]})`
  )
  container.setAttribute(
    'fill',
    theme.pallete(attrs.fill ?? 'none')
  )
  container.setAttribute(
    'fill-opacity',
    String(attrs.fillOpacity ?? 0.5)
  )
  container.setAttribute(
    'stroke',
    theme.pallete(attrs.stroke ?? 'info')
  )
  container.setAttribute(
    'stroke-width',
    String(attrs.strokeWidth ?? 1)
  )
  container.setAttribute(
    'stroke-opacity',
    String(attrs.strokeOpacity ?? 1)
  )

  return container
}

// ------

export const baseCanvasElementKnowledge = definePrefabKnowledge((utils) => {
  utils.tag('figures')
  utils.prop('position')
    .describe('the position of the element')
    .type('[number, number]')
    .optional('[0, 0]')
  utils.prop('rotation')
    .describe('the rotation of the element')
    .type('number')
    .optional('0')
  utils.prop('scale')
    .describe('the scale of the element')
    .type('number | [number, number]')
    .optional('[1, 1]')
})

export const fillableKnowledge = definePrefabKnowledge((utils) => {
  utils.prop('fill')
    .describe('the fill color of the element')
    .type('string')
    .optional('none')
  // utils.prop('fillOpacity')
  //   .describe('the fill opacity of the element')
  //   .type('number')
  //   .optional('1')
})

export const strokeableKnowledge = definePrefabKnowledge((utils) => {
  utils.prop('stroke')
    .describe('the stroke color of the element')
    .type('string')
    .optional('none')
  // utils.prop('strokeWidth')
  //   .describe('the stroke width of the element')
  //   .type('number')
  //   .optional('1')
})


