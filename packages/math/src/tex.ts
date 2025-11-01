import { theme } from '@chalk-dsl/utils-theme'
import katex from 'katex'

export function tex(input: string, color: string = 'primary') {
  const container = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  const object = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
  object.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml')
  const div = document.createElement('div')
  div.style.color = theme.pallete(color)
  const content = katex.renderToString(input, {
    output: 'mathml',
  })
  div.innerHTML = content
  object.appendChild(div)
  container.appendChild(object)
  const mount = () => {
    const k = div.querySelector('.katex')
    if (!k) return
    const { width, height } = k.getBoundingClientRect()
    object.setAttribute('width', String(width))
    object.setAttribute('height', String(height))
  }
  return [container, mount] satisfies [SVGGElement, () => void]
}