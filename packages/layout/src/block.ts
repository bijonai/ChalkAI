import { definePrefabKnowledge } from "@chalk-dsl/knowledge"
import { addPrefabKnowledge } from "@chalk-dsl/knowledge/default"
import { definePrefab, registerPrefab } from "@chalk-dsl/renderer-core"
import { theme } from "@chalk-dsl/utils-theme"

interface Direction {
  top: string | number
  right: string | number
  bottom: string | number
  left: string | number
  x: string | number
  y: string | number
}

export interface BlockAttributes {
  padding: string | number | Direction
  margin: string | number | Direction
  width: string | number
  height: string | number
}

const convertDirectionToCssValue = (direction: string | number | Direction): string => {
  if (typeof direction === 'string') {
    return theme.size(direction)
  } else if (typeof direction === 'number') {
    return `${direction}px`
  } else if (typeof direction === 'object') {
    return [
      direction.top ? convertDirectionToCssValue(direction.top) : convertDirectionToCssValue(direction.y),
      direction.right ? convertDirectionToCssValue(direction.right) : convertDirectionToCssValue(direction.x),
      direction.bottom ? convertDirectionToCssValue(direction.bottom) : convertDirectionToCssValue(direction.y),
      direction.left ? convertDirectionToCssValue(direction.left) : convertDirectionToCssValue(direction.x),
    ].join(' ')
  } else {
    return '0'
  }
}

export const block = definePrefab<'block', BlockAttributes>(() => {
  return {
    name: 'block',
    generator: (props, children) => {
      const block = document.createElement('div')
      block.style.width = props.width ? theme.size(props.width) : '100%'
      block.style.height = props.height ? theme.size(props.height) : 'auto'
      block.style.padding = props.padding ? convertDirectionToCssValue(props.padding) : '0'
      block.style.margin = props.margin ? convertDirectionToCssValue(props.margin) : '0'

      block.append(...children())

      return block
    }
  }
})

registerPrefab('block', block)

export default block

export const knowledge = definePrefabKnowledge((utils) => {
  utils.name('block')
  utils.description('A block of elements')
  utils.tag('layout')
  utils.prop('width')
    .describe('The width of the block')
    .type('string | number').optional('100%')
  utils.prop('height')
    .describe('The height of the block')
    .type('string | number').optional('auto')
  utils.prop('padding')
    .describe('The padding of the block')
    .type('string | number | { top: string | number, right: string | number, bottom: string | number, left: string | number, x: string | number, y: string | number }').optional('0')
  utils.prop('margin')
    .describe('The margin of the block')
    .type('string | number | { top: string | number, right: string | number, bottom: string | number, left: string | number, x: string | number, y: string | number }').optional('0')
})

addPrefabKnowledge(knowledge)
