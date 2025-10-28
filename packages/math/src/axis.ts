import { Vector2 } from "@chalk-dsl/canvas"
import { theme } from "@chalk-dsl/utils-theme"
import * as d3 from 'd3'

export interface RulerOptions {
  direction?: 'x' | 'y'
  division?: number
  offset?: number
  counter?: (count: number) => string
  textSize?: number
}
export const ruler = (
  range: Vector2,
  selection: d3.Selection<SVGGElement, unknown, null, unknown>,
  options: RulerOptions = {}
) => {
  const direction = options.direction ?? 'x'
  const division = options.division ?? 1
  const offset = options.offset ?? 0
  const counter = options.counter ?? ((count: number) => count.toString())
  const textSize = options.textSize ? String(options.textSize) : theme.size('xs')
  const [start, end] = range
  selection.attr('text-anchor', 'middle')
  selection.attr('dominant-baseline', 'middle')
  selection.attr('font-size', textSize)
  for (let i = start; i <= end; i += 1) {
    if (i === 0 && direction === 'y') continue
    const value = counter(i)
    selection.append('text')
      .text(value)
      .attr(direction, i * division)
      .attr(['x', 'y'][Number(direction === 'x')], offset)
  }
}
