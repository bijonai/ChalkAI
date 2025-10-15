import type { Template } from "..";

export const arc: Template = {
  id: 'arc',
  content: {
    name: 'root',
    props: [],
    refs: {
      angle: '0',
      position: '[0, 0]',
      "center": "[0, 0]",
      "completed": "false"
    },
    root: {
      name: 'columns',
      children: [
        {
          name: 'canvas',
          attrs: {
            range: [0, 100],
            domain: [0, 100],
            ':origin': '[50, 50]'
          },
          children: [
            {
              name: 'arc',
              attrs: {
                start: 0,
                end: 360,
                radius: '20',
                interactive: true,
                model: {
                  angle: 'angle',
                  position: 'position',
                }
              }
            }
          ]
        },
        {
          name: 'block',
          children: [
            'Angle: {{ angle }}',
          ],
        },
        {
          name: 'block',
          children: [
            'Position: {{ position }}',
          ],
        },
        {
          "name": "canvas",
          "attrs": {
            ":range": "[0, 80]",
            ":domain": "[0, 80]",
            ":origin": "[40, 40]"
          },
          "events": {},
          "children": [
            {
              "name": "arc",
              "attrs": {
                "model": {
                  "position": "center"
                },
                "stroke": "creative",
                ":radius": "30",
                ":position": "center",
                "interactive": true,
                "strokeWidth": 1
              },
              "events": {},
              "children": [],
              "animations": {},
              "statements": {}
            }
          ],
          "animations": {},
          "statements": {}
        }
      ]
    }
  }
}
