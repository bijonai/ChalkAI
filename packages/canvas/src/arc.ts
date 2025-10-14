import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core";
import { definePrefabKnowledge } from "@chalk-dsl/knowledge";
import { BaseCanvasElementAttributes, baseCanvasElementKnowledge, createCanvasElementContainer, fillableKnowledge, Fillable, Strokeable, strokeableKnowledge } from "./shared";
import * as d3 from 'd3'
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default";
import { theme } from "@chalk-dsl/utils-theme";
import { FormModelAttributes, parseModel } from "@chalk-dsl/form";

export interface ArcAttributes
  extends BaseCanvasElementAttributes, Fillable, Strokeable, FormModelAttributes<['angle', 'position']> {
  start: number
  end: number
  radius: number
  interactive: boolean
}

const arc = definePrefab<'arc', ArcAttributes>((context) => {
  return {
    name: 'arc',
    generator: (attrs) => {
      const root = createCanvasElementContainer(attrs)

      // Convert degrees to radians for d3.arc()
      const startAngle = (attrs.start * Math.PI) / 180
      const endAngle = (attrs.end * Math.PI) / 180

      const pathData = d3.arc()({
        startAngle: startAngle,
        endAngle: endAngle,
        innerRadius: 0,  // innerRadius should be 0 for a filled arc
        outerRadius: attrs.radius,
      })

      d3.select(root).append('path')
        .attr('d', pathData)

      const line1 = d3.select(root).append('line')
        .attr('x1', attrs.position?.[0] ?? 0)
        .attr('y1', attrs.position?.[1] ?? 0)
        .attr('x2', Math.cos(startAngle) * attrs.radius)
        .attr('y2', Math.sin(startAngle) * attrs.radius)
        .attr('stroke', attrs.stroke || theme.pallete('foreground'))
        .attr('stroke-width', (attrs.strokeWidth ?? 1) * 0.5)
        .attr('stroke-dasharray', '2,2')
        .attr('id', 'angleStartLine')

      const line2 = d3.select(root).append('line')
        .attr('x1', attrs.position?.[0] ?? 0)
        .attr('y1', attrs.position?.[1] ?? 0)
        .attr('x2', Math.cos(endAngle) * attrs.radius)
        .attr('y2', Math.sin(endAngle) * attrs.radius)
        .attr('stroke', attrs.stroke || theme.pallete('foreground'))
        .attr('stroke-width', (attrs.strokeWidth ?? 1) * 0.5)
        .attr('stroke-dasharray', '2,2')
        .attr('id', 'angleEndLine')

      if (attrs.interactive) {
        let offsetX = attrs.position?.[0] ?? 0
        let offsetY = attrs.position?.[1] ?? 0
        const dot = (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          selector: d3.Selection<any, unknown, null, undefined>,
          x: number,
          y: number,
          id: string,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onDrag: (x: number, y: number, selector: d3.Selection<any, unknown, null, undefined>) => void = () => { },
        ) => {

          let dragging = false
          return selector.append('circle')
            .attr('r', attrs.strokeWidth ?? 1)
            .attr('cx', x)
            .attr('cy', y)
            .attr('stroke', 'none')
            .attr('fill', theme.pallete('accent'))
            .attr('fill-opacity', 0.5)
            .on('mouseover', function () {
              d3.select(this)
                .attr('fill-opacity', 1)
                .attr('r', (attrs.strokeWidth ?? 1) * 1.2)
            })
            .on('mouseout', function () {
              if (dragging) return
              d3.select(this)
                .attr('fill-opacity', 0.5)
                .attr('r', attrs.strokeWidth ?? 1)
            })
            .attr('id', id)
            .call(
              d3.drag()
                .on('start', function (event) {
                  dragging = true
                  d3.select(this)
                    .classed('dragging', true)
                    .attr('fill-opacity', 1)
                    .attr('r', (attrs.strokeWidth ?? 1) * 1.2)
                  const ended = () => {
                    dragging = false
                    d3
                    .select(this)
                    .classed('dragging', false)
                    .attr('fill-opacity', 0.5)
                    .attr('r', attrs.strokeWidth ?? 1)
                  }
                  const dragged = (event: DragEvent) => {
                    onDrag(
                      event.x, event.y,
                      d3.select(this).raise()
                    )
                  }
                  event.on('drag', dragged)
                  event.on('end', ended)
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }) as any
            )
        }
        dot(
          d3.select(root),
          attrs.position?.[0] ?? 0,
          attrs.position?.[1] ?? 0,
          'center',
          (x, y, selector) => {
            console.log(x, y)
            offsetX = x
            offsetY = y
            d3.select(root).select('path')
              .attr('transform', `translate(${x}, ${y})`)
            selector
              .attr('cx', x)
              .attr('cy', y)
            d3.select(root).select('circle#angleStart')
              .attr('transform', `translate(${offsetX}, ${offsetY})`)
            d3.select(root).select('circle#angleEnd')
              .attr('transform', `translate(${offsetX}, ${offsetY})`)

            d3.select(root).select('line#angleStartLine')
              .attr('transform', `translate(${offsetX}, ${offsetY})`)
            d3.select(root).select('line#angleEndLine')
              .attr('transform', `translate(${offsetX}, ${offsetY})`)

            if (attrs.model && attrs.model.position) {
              context[attrs.model.position] = [x, y]
            }
          }
        )
        dot(
          d3.select(root),
          Math.cos(startAngle) * attrs.radius,
          Math.sin(startAngle) * attrs.radius,
          'angleStart',
          (x, y, selector) => {
            const angle = Math.atan2(y - offsetY, x - offsetX)
            console.log(offsetX, offsetY)
            const _x = Math.cos(angle) * attrs.radius
            const _y = Math.sin(angle) * attrs.radius
            if (attrs.model && attrs.model.angle) {
              context[attrs.model.angle] = angle * 180 / Math.PI
            }
            selector.attr('cx', _x)
            selector.attr('cy', _y)
            d3.select(root).select('line#angleStartLine')
              .attr('x2', _x)
              .attr('y2', _y)
          }
        )
        dot(
          d3.select(root),
          Math.cos(endAngle) * attrs.radius,
          Math.sin(endAngle) * attrs.radius,
          'angleEnd',
          (x, y, selector) => {
            const angle = Math.atan2(y - offsetY, x - offsetX)
            console.log(offsetX, offsetY)
            const _x = Math.cos(angle) * attrs.radius
            const _y = Math.sin(angle) * attrs.radius
            if (attrs.model && attrs.model.angle) {
              context[attrs.model.angle] = angle * 180 / Math.PI
            }
            selector.attr('cx', _x)
            selector.attr('cy', _y)
            d3.select(root).select('line#angleEndLine')
              .attr('x2', _x)
              .attr('y2', _y)
          }
        )

      }

      return root
    },
    defaults: {
      start: 0,
      end: 360,
      interactive: false,
    }
  }
})

registerPrefab('arc', arc)

export default arc

// ------

export const knowledge = definePrefabKnowledge<ArcAttributes>((utils) => {
  utils.name('arc')
  utils.description('Arc (circle), used in canvas')
  utils.extend(baseCanvasElementKnowledge)
  utils.extend(fillableKnowledge)
  utils.extend(strokeableKnowledge)

  utils.prop('start')
    .describe('the start angle of the arc')
    .type('number')
    .optional('0')
  utils.prop('end')
    .describe('the end angle of the arc')
    .type('number')
    .optional('360')
  utils.prop('radius')
    .describe('the radius of the arc')
    .type('number')
  utils.prop('interactive')
    .describe('whether the arc is interactive, if true, will show a control point for `angle`, a control point for `position`')
    .type('boolean')
    .optional('false')
  utils.prop('model')
    .describe('The variable to bind on two control points')
    .type('{ angle: string, position: string }').optional()
})

addPrefabKnowledge(knowledge)
