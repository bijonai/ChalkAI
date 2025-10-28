import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkEmoji from 'remark-emoji'
import rehypeShiki from '@shikijs/rehype'
import { unified } from 'unified'

export const createMarkdown = () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkEmoji)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeKatex, { output: 'mathml' })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .use(rehypeShiki, {
      themes: {
        default: 'github-dark',
      },
    })
  return async (source: string) => {
    // Replace all `[<...>]<content>[/<...>]` to `<span class="..."><content></span>`
    const processed = source.replaceAll(/\[(.*?)\](.*?)\[\/(.*?)\]/g, (match, p1, p2) => {
      return `<span class="${p1}">${p2}</span>`
    })
    return processor.process(processed)
  }
}