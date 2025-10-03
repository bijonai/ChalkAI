import type { Template } from "..";

export const input: Template = {
  id: 'input',
  content: {
    name: 'input',
    props: [],
    refs: {
      content: '"content"',
    },
    root: {
      name: 'columns',
      children: [
        {
          name: 'input',
          attrs: {
            model: 'content',
          },
        },
        {
          name: 'block',
          children: [
            '{{ content }}',
          ],
        }
      ],
    },
  },
}