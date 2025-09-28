import type { Template } from "..";

export const columns: Template = {
  id: 'columns-&-rows',
  content: {
    name: 'root',
    props: [],
    root: {
      name: 'columns',
      attrs: {
        gap: 10,
      },
      children: [
        {
          name: 'block',
          children: [
            {
              name: 'rows',
              children: [
                { name: 'block', children: ['Item 1'] },
                { name: 'block', children: ['Item 2'] },
                { name: 'block', children: ['Item 3'] },
              ],
            }
          ]
        },
        {
          name: 'block',
          children: [
            {
              name: 'rows',
              children: [
                { name: 'block', children: ['Item 1'] },
                { name: 'block', children: ['Item 2'] },
              ],
            }
          ]
        },
        {
          name: 'block',
          children: [
            { name: 'rows', children: [{ name: 'block', children: ['Item 3'] }] },
          ],
        },
      ],
    },
  },
}