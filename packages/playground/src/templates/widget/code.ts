import type { Template } from "..";

export const code: Template = {
  id: 'code',
  content: {
    name: 'code',
    props: [],
    root: {
      name: 'code',
      attrs: {
        lang: 'javascript',
      },
      children: [
        { name: 'block', children: ['console.log("Hello, world!");'] },
      ],
    },
  }
}