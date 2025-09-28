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
                { name: 'block', children: ['**Item 1**'] },
                {
                  name: 'block', children: ['- item1 \n - item2 \n - item3']
                },
                { name: 'block', children: ['| a | b | \n | - | - | \n | c | d |'] },
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
                { name: 'block', children: ['**Item 1**'] },
                { name: 'block', children: ['_Item 2_'] },
              ],
            }
          ]
        },
        {
          name: 'block',
          children: [
            { name: 'rows', children: [{ name: 'block', children: ['**Item 3**'] }] },
          ],
        },
      ],
    },
  },
}