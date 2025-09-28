import type { Template } from "..";

export const grid: Template = {
  id: 'grid',
  content: {
    name: 'root',
    props: [],
    root: {
      name: 'grid',
      attrs: {
        columns: 3,
        rows: 3,
        gap: 10,
      },
      children: [
        {
          name: 'block',
          attrs: {
            padding: '{{ i * 10 }}'
          },
          children: [
            '{{ "Item " + i }}'
          ],
          statements: {
            for: 'i in [1, 2]',
          }
        }
      ],
    },
  },
}