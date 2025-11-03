import { BaseCanvasElementAttributes, createCanvasElementContainer, Vector2 } from "@chalk-dsl/canvas";
import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core";
import { theme } from "@chalk-dsl/utils-theme";
import * as d3 from 'd3'

export interface ParameterAttributes extends BaseCanvasElementAttributes {
  expr: (t: number) => Vector2
  range: Vector2
  domain: Vector2
  color: string
}

const curve = (
  expr: (t: number) => Vector2,
  domain: Vector2,
  range: Vector2,
  division: Vector2,
) => {
  const [xDivision, yDivision] = division
  const [start, end] = domain
  const [min, max] = range
  
  const [startX, startY] = expr(start)
  let path = `M${startX * xDivision},${startY * yDivision} `
  let length = 0
  let lastX = startX * xDivision
  let lastY = startY * yDivision
  let isOverflow = false
  
  const step = (end - start) / (Math.max(Math.abs(xDivision), Math.abs(yDivision)) * 100)
  
  for (let t = start; t <= end; t += step) {
    const [x, y] = expr(t)
    const scaledX = x * xDivision
    const scaledY = y * yDivision
    
    if (
      x < min || x > max ||
      y < min || y > max
    ) {
      isOverflow = true
      continue
    }
    
    if (isOverflow) {
      path += `M${scaledX},${scaledY} `
      isOverflow = false
    } else {
      path += `L${scaledX},${scaledY} `
    }
    
    length += Math.sqrt((scaledX - lastX) ** 2 + (scaledY - lastY) ** 2)
    lastX = scaledX
    lastY = scaledY
  }
  
  return { path, length }
}

const parameter = definePrefab<'parameter', ParameterAttributes>((context) => {
  return {
    name: 'parameter',
    generator: (attrs) => {
      const root = createCanvasElementContainer(attrs, context.division)

      const { path } = curve(attrs.expr, attrs.domain, attrs.range, context.division)

      d3.select(root).append('path')
        .attr('d', path)
        .attr('stroke-width', 2)
        .attr('stroke', theme.pallete(attrs.color))
      return root
    }
  }
})

export default parameter
registerPrefab('parameter', parameter)