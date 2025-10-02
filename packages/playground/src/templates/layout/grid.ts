import type { Template } from "..";

export const grid: Template = {
  id: 'grid',
  content: {
    name: 'root',
    props: [],
    refs: {
      items: 'Array.from({ length: 8 }, (_, i) => i)',
    },
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
            // padding: '{{ i * 10 }}'
          },
          children: [
            '{{ "Item " + (i + 1) }}'
          ],
          events: {
            'click': 'items.push(233)'
          },
          statements: {
            for: 'i in items',
          }
        }
      ],
    },
  },
}