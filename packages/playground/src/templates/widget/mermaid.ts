import type { Template } from "..";

export const mermaid: Template = {
  id: 'mermaid',
  content: {
    name: 'mermaid',
    props: [],
    root: {
      name: 'mermaid',
      attrs: {},
      children: [
        'graph TD; A-->B; A-->C',
      ],
    },
  }
}