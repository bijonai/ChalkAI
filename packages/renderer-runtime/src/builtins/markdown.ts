import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { unified } from 'unified'

export const createMarkdown = () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
  return (source: string) => {
    // Replace all `[<...>]<content>[/<...>]` to `<span class="..."><content></span>`
    const processed = source.replaceAll(/`\[<([^>]+)>\]<([^>]+)>\/<([^>]+)>`/g, (match, p1, p2) => {
      return `<span class="${p1}">${p2}</span>`
    })
    return processor.processSync(processed).toString()
  }
}