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
            '{{ "Item " + (i + 1) }}'
          ],
          statements: {
            for: 'i in Array.from({ length: 9 }, (_, i) => i)',
          }
        }
      ],
    },
  },
}