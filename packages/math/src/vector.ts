import type { Vector2 } from "@chalk-dsl/canvas";
import { theme } from "@chalk-dsl/utils-theme";
import * as d3 from 'd3'

export const arrow = (
  x1: number, y1: number,
  x2: number, y2: number,
  selection: d3.Selection<SVGGElement, unknown, null, any>,
  color: string = theme.pallete('primary')
) => {
  selection.append('line')
    .attr('x1', x1)
    .attr('y1', y1)
    .attr('x2', x2)
    .attr('y2', y2)
    .attr('stroke', color)

  selection.append('polygon')
    .attr('points', '0,0 -5,3 7,0 -5,-3 0,0')
    .attr(
      'transform',
      `translate(${x2}, ${y2}) rotate(${Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI})`
    )
    .attr('fill', color)
    .attr('fill-opacity', 1)
    .attr('stroke', 'none')

  return selection
}