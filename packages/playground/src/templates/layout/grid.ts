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
      children: Array.from({ length: 9 }, (_, i) => ({
        name: 'block',
        children: [
          `Item ${i + 1}`,
        ],
      })),
    },
  },
}