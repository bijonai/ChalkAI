import type { Template } from "..";

export const table: Template = {
  id: 'table',
  content: {
    name: 'table',
    props: [],
    refs: {
      content: 'null',
    },
    root: {
      name: 'table',
      attrs: {
        direction: 'horizontal',
        columns: 2,
        // rows: 2,
        gap: 10,
      },
      children: [
        { name: 'block', children: ['Table'], statements: { slot: 'content' } },
        { name: 'block', children: ['Table'], statements: { slot: 'content' } },
        { name: 'block', children: ['Table'], statements: { slot: 'content' } },
      ],
    },
  },
}