import { definePrefabKnowledge } from '@chalk-dsl/knowledge'
import { theme } from '@chalk-dsl/utils-theme'
import * as d3 from 'd3'

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
>(attrs: T & Partial<F & S>) => {
  attrs.position ??= [0, 0]
  attrs.rotation ??= 0
  const scale = attrs.scale ? Array.isArray(attrs.scale) ? attrs.scale : [attrs.scale, attrs.scale] : [1, 1]

  const container = d3.create('g')
    .attr(
      'transform',
      `translate(${attrs.position[0]}, ${attrs.position[1]}) rotate(${attrs.rotation}) scale(${scale[0]}, ${scale[1]})`
    )
    .attr(
      'fill',
      theme.pallete(attrs.fill ?? 'none')
    )
    .attr(
      'fill-opacity',
      attrs.fillOpacity ?? 1
    )
    .attr(
      'stroke',
      theme.pallete(attrs.stroke ?? 'none')
    )
    .attr(
      'stroke-width',
      attrs.strokeWidth ?? 1
    )
    .attr(
      'stroke-opacity',
      attrs.strokeOpacity ?? 1
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
  utils.prop('fillOpacity')
    .describe('the fill opacity of the element')
    .type('number')
    .optional('1')
})

export const strokeableKnowledge = definePrefabKnowledge((utils) => {
  utils.prop('stroke')
    .describe('the stroke color of the element')
    .type('string')
    .optional('none')
  utils.prop('strokeWidth')
    .describe('the stroke width of the element')
    .type('number')
    .optional('1')
})
