import type { Template } from "..";

export const plane: Template = {
  id: 'plane',
  content: {
    name: 'root',
    props: [],
    root: {
      name: 'canvas',
      attrs: {
        division: 20,
      },
      children: [
        {
          name: 'plane',
          attrs: {
            range: [-5, 5],
            domain: [-5, 5],
          },
          children: [
            {
              name: 'function',
              attrs: {
                ':expr': '(x) => x * i * Math.sin(x)',
                domain: [-5, 5],
                range: [-5, 5],
                color: 'primary',
              },
              statements: {
                for: 'i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]'
              }
            }
          ]
        }
      ]
    },
  },
}