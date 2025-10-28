import { BaseCanvasElementAttributes, createCanvasElementContainer, Vector2 } from "@chalk-dsl/canvas";
import { definePrefabKnowledge } from "@chalk-dsl/knowledge";
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default";
import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core";
import { theme } from "@chalk-dsl/utils-theme";
import * as d3 from 'd3';

export interface FunctionAttributes extends BaseCanvasElementAttributes {
  expr: (x: number) => number
  domain: Vector2
  range: Vector2
  color: string
}

const curve = (
  expr: (x: number) => number,
  domain: Vector2,
  range: Vector2,
  division: Vector2,
) => {
  console.log(domain, range, division)
  const [xDivision, yDivision] = division
  const [start, end] = domain
  const [min, max] = range
  let path = `M${start * xDivision},${expr(start) * yDivision} `
  let length = 0
  let lastX = start * xDivision
  let lastY = expr(start) * yDivision
  let isOverflow = false
  for (let i = start; i <= end; i += 1 / xDivision) {
    const y = expr(i) * yDivision
    console.log(yDivision)
    if (y <= min * Math.abs(yDivision) || y >= max * Math.abs(yDivision)) {
      isOverflow = true
      continue
    }
    const x = i * xDivision
    if (isOverflow) {
      path += `M${x},${y} `
      isOverflow = false
    } else {
      path += `L${x},${y} `
    }
    length += Math.sqrt((x - lastX) ** 2 + (y - lastY) ** 2)
    lastX = x
    lastY = y
  }
  return { path, length }
}

const func = definePrefab<'function', FunctionAttributes, { division: Vector2 }>((context) => {
  return {
    name: 'function',
    generator: (attrs) => {
      const root = createCanvasElementContainer(attrs, context.division)
      const { path } = curve(attrs.expr, attrs.domain, attrs.range ?? attrs.domain, context.division)

      d3.select(root).append('path')
        .attr('d', path)
        .attr('stroke-width', 1)
        .attr('stroke', theme.pallete(attrs.color))
      return root
    },
    defaults: {
      color: 'primary',
    }
  }
})

export default func
registerPrefab('function', func)

// ------

export const knowledge = definePrefabKnowledge((utils) => {
  utils.name('function')
  utils.description('A function graph under `canvas`')
  utils.prop('expr')
    .describe('The expression of the function')
    .type('(x: number) => number')
  utils.prop('domain')
    .describe('The domain of the function')
    .type('[number, number]')
  utils.prop('range')
    .describe('The range of the function')
    .type('[number, number]')
  utils.prop('color')
    .describe('The color of the function')
    .optional('primary')
  utils.rule('`function` must be used under a `canvas` element, better under a `plane` element')
  utils.rule('`plane` element must be used under a `canvas` element')
})
addPrefabKnowledge(knowledge)
