import type { Template } from "..";

export const arc: Template = {
  id: 'arc',
  content: {
    name: 'root',
    props: [],
    root: {
      name: 'canvas',
      attrs: {
        range: [0, 100],
        domain: [0, 100],
        origin: [50, 50]
      },
      children: [
        {
          name: 'arc',
          attrs: {
            start: 0,
            end: 360,
            radius: 20,
            interactive: true,
          }
        }
      ]
    }
  }
}