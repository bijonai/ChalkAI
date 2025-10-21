import type { Template } from "..";

export const vector: Template = {
  id: 'vector',
  content: {
    name: 'root',
    props: [],
    root: {
      name: 'columns',
      children: [
        {
          name: 'rows',
          children: [
            {
              name: 'block',
              attrs: {
                width: '50%',
              },
              children: [
                'Horizontal Vector'
              ]
            },
            {
              name: 'canvas',
              attrs: {
              },
              children: [
                {
                  name: 'plane',
                  attrs: {
                    range: [-10, 10],
                    domain: [-10, 10],
                  },
                  children: [
                    {
                      name: 'vector',
                      attrs: { from: '[0, 0]', ':to': '[i + 5, i]', color: 'accent' },
                      statements: {
                        for: 'i in [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]',
                      },
                    },
                    {
                      name: 'vector',
                      attrs: { from: '[0, 0]', ':to': '[i - 5, i]', color: 'creative' },
                      statements: {
                        for: 'i in [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]',
                      },
                    },
                    {
                      name: 'function',
                      attrs: {
                        ':expr': '(x) => x + 5',
                        domain: [-10, 10],
                        color: 'info'
                      }
                    },
                    {
                      name: 'function',
                      attrs: {
                        ':expr': '(x) => x - 5',
                        domain: [-10, 10],
                        color: 'info'
                      }
                    },
                    {
                      name: 'function',
                      attrs: {
                        ':expr': '(x) => x',
                        domain: [-10, 10],
                      }
                    }
                  ],
                }
              ],
            }
          ]
        },
      ]
    }
  },
}