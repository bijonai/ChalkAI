import type { Template } from "..";

export const slider: Template = {
  id: 'slider',
  content: {
    name: 'slider',
    props: [],
    refs: {
      content: '0',
      min: '0',
      max: '100',
      step: '0.5',
      unit: '""',
      title: '"Slider"',
    },
    root: {
      name: 'columns',
      children: [
        {
          name: 'slider',
          attrs: {
            model: 'content',
            ':min': 'min === "" ? undefined : Number(min)',
            ':max': 'max === "" ? undefined : Number(max)',
            ':step': 'step === "" ? undefined : Number(step)',
            ':unit': 'unit ?? ""',
            ':title': 'title === "" ? undefined : title',
          },
          statements: {
            slot: 'content',
          }
        },
        {
          name: 'block',
          children: [
            'value: {{ content }}{{ unit || "" }}',
          ],
        },
        {
          name: 'block',
          attrs: {
            padding: 16,
          },
          children: [
            '## Slider Parameters',
            {
              name: 'grid',
              attrs: {
                columns: 2,
                gap: 12,
              },
              children: [
                '**Min**',
                {
                  name: 'input',
                  attrs: {
                    placeholder: 'Minimum value',
                    model: 'min',
                  },
                },
                '**Max**',
                {
                  name: 'input',
                  attrs: {
                    placeholder: 'Maximum value',
                    model: 'max',
                  },
                },
                '**Step**',
                {
                  name: 'input',
                  attrs: {
                    placeholder: 'Step size',
                    model: 'step',
                  },
                },
                '**Unit**',
                {
                  name: 'input',
                  attrs: {
                    placeholder: 'Unit (e.g. %)',
                    model: 'unit',
                  },
                },
                '**Title**',
                {
                  name: 'input',
                  attrs: {
                    placeholder: 'Tooltip title',
                    model: 'title',
                  },
                },
              ],
            },
          ],
        }
      ],
    },
  }
}
